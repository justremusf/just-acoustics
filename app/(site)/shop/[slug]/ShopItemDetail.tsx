// Server component: resolves product data, image URLs and copy on the server
// and renders the static sections here. Only the interactive islands
// (gallery + configurator, accordions, chart, calculator, before/after, FAQ)
// ship JavaScript.
import type { ShopItem } from "@/lib/types";
import { getProductProfile } from "@/lib/shopProductProfiles";
import {
  SOOTHE_FABRIC_CHARTS,
  SOOTHE_VISIBLE_FABRIC_IDS,
  STANDARD_FLEXI_COLOUR_CHART_SRC,
  STANDARD_FLEXI_IN_USE_IMAGES,
  STANDARD_FLEXI_VISIBLE_COLOUR_IDS,
} from "./productData";
import {
  getConfigurableItem,
  getImageSrc,
  getProductMedia,
  isFlexiProduct,
  isSootheProduct,
} from "./productHelpers";
import { getProductDetailPanels } from "./productDetailPanels";
import ProductDetailView from "./ProductDetailView";
import { ProductDetailAccordions } from "./ProductDetailAccordions";
import { ProductPerformanceSection } from "./ProductPerformance";
import {
  LazyProductBeforeAfterSection,
  LazyProductPanelCalculator,
} from "./ProductLazySections";
import {
  CustomPrintWorkflow,
  ProductFeatureCards,
  ProductInfoFaqSection,
  ProductInstallationDownloads,
  ProductInUseGallery,
  ProductReviewsSection,
  ProductStorySections,
} from "./ProductSections";

// Gallery images hidden for Soothe products (the fabric charts are shown instead).
const SOOTHE_HIDDEN_GALLERY_KEYS = [
  "1f0374981776",
  "8aac81e8e0db",
  "soothe-weave-8080",
  "soothe-weave-2020",
];

export default function ShopItemDetail({ item }: { item: ShopItem }) {
  const isStandardFlexi = isFlexiProduct(item);
  const isSoothe = isSootheProduct(item);
  const profile = getProductProfile(item);
  const configurableItem = getConfigurableItem(item);

  const baseImages = [item.mainImage, ...(item.gallery || [])]
    .filter(
      (image) =>
        !(
          isSoothe &&
          image &&
          "_key" in image &&
          SOOTHE_HIDDEN_GALLERY_KEYS.includes(String(image._key))
        ),
    )
    .map((image, index) => {
      const src =
        isStandardFlexi &&
        image &&
        "_key" in image &&
        image._key === "standard-flexi-colour-chart"
          ? STANDARD_FLEXI_COLOUR_CHART_SRC
          : getImageSrc(image, 1200, 1500);
      return src ? { src, alt: `${item.title} ${index + 1}` } : null;
    })
    .filter((image): image is { src: string; alt: string } => Boolean(image));

  return (
    <ProductDetailView
      title={item.title}
      displayPrice={item.price}
      pricePrefix={profile.pricePrefix}
      configurableItem={configurableItem}
      profile={{
        line: profile.line,
        quoteOnly: profile.quoteOnly,
        artworkReview: profile.artworkReview,
        customSizes: profile.customSizes,
        shortDescription: profile.shortDescription,
      }}
      productLine={profile.line}
      isStandardFlexi={isStandardFlexi}
      isSoothe={isSoothe}
      visibleColourIds={
        isStandardFlexi
          ? STANDARD_FLEXI_VISIBLE_COLOUR_IDS
          : isSoothe
            ? SOOTHE_VISIBLE_FABRIC_IDS
            : null
      }
      media={getProductMedia(configurableItem)}
      baseImages={baseImages}
      inUseImages={isStandardFlexi ? STANDARD_FLEXI_IN_USE_IMAGES : []}
      fabricCharts={SOOTHE_FABRIC_CHARTS}
      colourChartSrc={STANDARD_FLEXI_COLOUR_CHART_SRC}
      accordions={
        <ProductDetailAccordions
          panels={getProductDetailPanels(configurableItem)}
        />
      }
    >
      <div className="mt-8 grid gap-8">
        <ProductFeatureCards item={item} />
        {isStandardFlexi && <ProductInUseGallery />}
        {profile.line !== "accessory" && (
          <>
            <LazyProductPanelCalculator
              line={profile.line}
              productTitle={item.title}
              productSlug={item.slug.current}
            />
            <ProductPerformanceSection item={item} />
          </>
        )}
        {isStandardFlexi && <LazyProductBeforeAfterSection />}
        {profile.line === "custom-print-panels" && <CustomPrintWorkflow />}
        <ProductStorySections item={item} />
        {isStandardFlexi && <ProductInstallationDownloads />}
        <ProductReviewsSection item={item} />
        <ProductInfoFaqSection item={item} />
      </div>
    </ProductDetailView>
  );
}
