import { Injectable } from '@angular/core';
import { toPng, toJpeg, toBlob } from 'html-to-image';
import { jsPDF } from 'jspdf';

export interface PdfExportOptions {
  orientation?: 'p' | 'l';
  format?: 'a4' | 'thermal';
  margin?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BillExportService {

  /**
   * Generates high-resolution PNG Data URL from a DOM container.
   * Ensures full scrollHeight is captured without clipping.
   */
  async exportToPng(element: HTMLElement): Promise<string> {
    const scrollHeight = element.scrollHeight || element.offsetHeight;
    const scrollWidth = element.scrollWidth || element.offsetWidth;
    return await toPng(element, {
      quality: 0.98,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      height: scrollHeight,
      width: scrollWidth,
      style: {
        maxHeight: 'none',
        height: `${scrollHeight}px`,
        overflow: 'visible'
      }
    });
  }

  /**
   * Generates high-resolution JPEG Data URL from a DOM container.
   */
  async exportToJpeg(element: HTMLElement): Promise<string> {
    const scrollHeight = element.scrollHeight || element.offsetHeight;
    const scrollWidth = element.scrollWidth || element.offsetWidth;
    return await toJpeg(element, {
      quality: 0.95,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      height: scrollHeight,
      width: scrollWidth,
      style: {
        maxHeight: 'none',
        height: `${scrollHeight}px`,
        overflow: 'visible'
      }
    });
  }

  /**
   * Generates Blob from DOM element for native Web Share API file sharing.
   */
  async exportToBlob(element: HTMLElement): Promise<Blob | null> {
    const scrollHeight = element.scrollHeight || element.offsetHeight;
    const scrollWidth = element.scrollWidth || element.offsetWidth;
    return await toBlob(element, {
      quality: 0.98,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      height: scrollHeight,
      width: scrollWidth,
      style: {
        maxHeight: 'none',
        height: `${scrollHeight}px`,
        overflow: 'visible'
      }
    });
  }

  /**
   * Generates and downloads a multi-page PDF using jsPDF.
   * If the bill exceeds 1 page, slices cleanly into proportional A4 pages with page numbers.
   */
  async downloadPdf(
    element: HTMLElement,
    filename: string,
    optionsOrOrientation: 'p' | 'l' | PdfExportOptions = 'p'
  ): Promise<void> {
    try {
      const options: PdfExportOptions = typeof optionsOrOrientation === 'string'
        ? { orientation: optionsOrOrientation, format: 'a4' }
        : { orientation: 'p', format: 'a4', ...optionsOrOrientation };

      const orientation = options.orientation || 'p';
      const imgData = await this.exportToPng(element);

      // Load image to read natural pixel dimensions
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (e) => reject(e);
        img.src = imgData;
      });

      const imgWidth = img.naturalWidth || img.width || 800;
      const imgHeight = img.naturalHeight || img.height || 1000;

      // Handle Thermal 80mm continuous roll receipt
      if (options.format === 'thermal') {
        const rollWidthMm = 80;
        const sideMargin = 4;
        const contentWidthMm = rollWidthMm - (sideMargin * 2);
        const rollHeightMm = Math.max(100, (imgHeight * contentWidthMm) / imgWidth + 12);

        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: [rollWidthMm, rollHeightMm]
        });

        pdf.addImage(imgData, 'PNG', sideMargin, 6, contentWidthMm, (imgHeight * contentWidthMm) / imgWidth);
        pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
        return;
      }

      // Standard A4 Multi-Page PDF Handling
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = options.margin !== undefined ? options.margin : 10;
      const contentWidth = pageWidth - (margin * 2); // 190mm on portrait A4
      const maxContentHeightPerPage = pageHeight - (margin * 2) - 8; // 269mm on portrait A4

      const totalContentHeightMm = (imgHeight * contentWidth) / imgWidth;

      // Case 1: Fits entirely on a single page
      if (totalContentHeightMm <= maxContentHeightPerPage) {
        pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, totalContentHeightMm);
        pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
        return;
      }

      // Case 2: Multi-Page slicing for bills with maximum items
      const sliceHeightPx = Math.floor((maxContentHeightPerPage * imgWidth) / contentWidth);
      const totalPages = Math.max(1, Math.ceil(imgHeight / sliceHeightPx));

      for (let i = 0; i < totalPages; i++) {
        const sy = i * sliceHeightPx;
        const sh = Math.min(sliceHeightPx, imgHeight - sy);

        const canvas = document.createElement('canvas');
        canvas.width = imgWidth;
        canvas.height = sh;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, sy, imgWidth, sh, 0, 0, imgWidth, sh);
        }

        const sliceDataUrl = canvas.toDataURL('image/png', 0.98);
        const sliceHeightMm = (sh * contentWidth) / imgWidth;

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(sliceDataUrl, 'PNG', margin, margin, contentWidth, sliceHeightMm);

        // Add page footer
        pdf.setFontSize(8);
        pdf.setTextColor(140, 140, 140);
        pdf.text(
          `पान ${i + 1} / ${totalPages} • Page ${i + 1} of ${totalPages}`,
          pageWidth - margin - 35,
          pageHeight - 4
        );
      }

      pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    } catch (err) {
      console.error('PDF export failed, falling back to print preview:', err);
      window.print();
    }
  }

  /**
   * Initiates browser download of an image Blob.
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  /**
   * Initiates browser download of a Data URL.
   */
  downloadDataUrl(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Triggers hardware printer via browser print dialog.
   */
  triggerPrint(): void {
    window.print();
  }
}

