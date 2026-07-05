import { WallpaperGrid } from "@/components/shared/wallpaper-grid";
import { WallpaperMaskSlider } from "@/components/shared/wallpaper-mask-slider";
import { WallpaperUpload } from "@/components/shared/wallpaper-upload";
import { WallpaperUrlImport } from "@/components/shared/wallpaper-url-import";

export function WallpaperPicker() {
  return (
    <div className="space-y-3">
      <WallpaperUpload />
      <WallpaperUrlImport />
      <WallpaperMaskSlider />
      <WallpaperGrid />
    </div>
  );
}
