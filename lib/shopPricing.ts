import type {
  ShopColourOption,
  ShopInstallationOption,
  ShopItem,
  ShopPackageOption,
  ShopSizeOption,
  ShopThicknessOption,
} from './types'

export type ShopQuoteSelection = {
  sizeId?: string
  thicknessId?: string
  colourId?: string
  installationId?: string
  packageId?: string
  quantity: number
  customPrint: boolean
}

export type ShopPriceBreakdown = {
  currency: 'SGD'
  panelCount: number
  quantityLabel: string
  unitBase: number
  packageBase: number | null
  perPanelAdjustment: number
  installationTotal: number
  subtotal: number
  total: number
  requiresReview: boolean
  lines: { label: string; amount: number }[]
}

type AvailableOption = {
  id?: string
  available?: boolean
}

export function formatSgd(amount: number) {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(Math.round(amount))
}

export function availableOptions<T extends AvailableOption>(options?: T[]) {
  return (options || []).filter((option) => option.available !== false)
}

export function findAvailable<T extends AvailableOption>(options: T[] | undefined, id?: string) {
  const available = availableOptions(options)
  return available.find((option) => option.id === id) || available[0]
}

export function getDefaultSelection(item: ShopItem): ShopQuoteSelection {
  const firstSize = findAvailable(item.sizeOptions, item.defaultSizeId)
  const firstThickness = findAvailable(item.thicknessOptions, item.defaultThicknessId)
  const firstColour = findAvailable(item.colourOptions)
  const firstInstallation = findAvailable(item.installationOptions)

  return {
    packageId: undefined,
    sizeId: firstSize?.id,
    thicknessId: firstThickness?.id,
    colourId: firstColour?.id,
    installationId: firstInstallation?.id,
    quantity: Math.max(item.defaultQuantity || item.minQuantity || 1, item.minQuantity || 1),
    customPrint: false,
  }
}

export function resolveShopSelection(item: ShopItem, selection: ShopQuoteSelection) {
  return {
    packageOption: selection.packageId ? findAvailable<ShopPackageOption>(item.packageOptions, selection.packageId) : undefined,
    sizeOption: findAvailable<ShopSizeOption>(item.sizeOptions, selection.sizeId),
    thicknessOption: findAvailable<ShopThicknessOption>(item.thicknessOptions, selection.thicknessId),
    colourOption: findAvailable<ShopColourOption>(item.colourOptions, selection.colourId),
    installationOption: findAvailable<ShopInstallationOption>(item.installationOptions, selection.installationId),
  }
}

export function normaliseQuantity(item: ShopItem, quantity: number) {
  const min = item.minQuantity || 1
  const max = item.maxQuantity
  const rounded = Number.isFinite(quantity) ? Math.floor(quantity) : min
  return Math.max(min, max ? Math.min(max, rounded) : rounded)
}

export function calculateShopPrice(item: ShopItem, rawSelection: ShopQuoteSelection): ShopPriceBreakdown {
  const selection = {
    ...rawSelection,
    quantity: normaliseQuantity(item, rawSelection.quantity),
    customPrint: item.allowCustomPrint ? rawSelection.customPrint : false,
  }
  const { packageOption, sizeOption, thicknessOption, colourOption, installationOption } = resolveShopSelection(item, selection)
  const basePrice = item.price || 0
  const packagePanelCount = packageOption?.panelCount || 0
  const panelCount = Math.max(1, packagePanelCount || 1) * selection.quantity
  const perPanelAdjustment =
    (sizeOption?.priceAdjustment || 0) +
    (thicknessOption?.priceAdjustment || 0) +
    (colourOption?.priceAdjustment || 0) +
    (selection.customPrint ? item.customPrintPrice || 0 : 0)

  const packageBase = packageOption
    ? packageOption.price ?? (basePrice * Math.max(1, packagePanelCount) * (1 - ((packageOption.discountPercent || 0) / 100)))
    : null

  const productSubtotal = packageOption
    ? (packageBase || 0) * selection.quantity + perPanelAdjustment * panelCount
    : (basePrice + perPanelAdjustment) * panelCount

  const installationTotal = installationOption?.priceType === 'fixed'
    ? installationOption.price || 0
    : installationOption?.priceType === 'perUnit'
      ? (installationOption.price || 0) * panelCount
      : 0

  const lines = [
    { label: packageOption ? `${packageOption.name || 'Package'} base` : 'Product subtotal', amount: productSubtotal },
    ...(installationTotal ? [{ label: installationOption?.label || 'Installation', amount: installationTotal }] : []),
  ]

  return {
    currency: 'SGD',
    panelCount,
    quantityLabel: packageOption ? `${selection.quantity} set${selection.quantity === 1 ? '' : 's'}` : `${panelCount} panel${panelCount === 1 ? '' : 's'}`,
    unitBase: basePrice,
    packageBase,
    perPanelAdjustment,
    installationTotal,
    subtotal: productSubtotal,
    total: productSubtotal + installationTotal,
    requiresReview:
      Boolean(selection.customPrint && item.customPrintRequiresReview !== false) ||
      item.productLine === 'custom-print-panels' ||
      item.checkoutMode !== 'payment-ready',
    lines,
  }
}
