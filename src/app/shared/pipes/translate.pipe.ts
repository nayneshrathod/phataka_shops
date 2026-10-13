import { Pipe, PipeTransform, inject } from "@angular/core";
import { TranslationService } from "@core/i18n/translation.service";

@Pipe({
  name: "translate",
  standalone: true,
  pure: false // Evaluates reactively when language signal updates
})
export class TranslatePipe implements PipeTransform {
  private translationService = inject(TranslationService);

  transform(key: string): string {
    return this.translationService.t(key);
  }
}
