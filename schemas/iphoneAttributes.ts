import { defineField, defineType } from 'sanity';
import { NumberInputProps, PrimitiveInputElementProps, NumberSchemaType } from 'sanity';
import { ReactNode, FormEvent, ChangeEvent } from 'react';

// Define types for our custom input components
interface CustomInputElementProps extends Omit<PrimitiveInputElementProps, 'value' | 'onChange'> {
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement> | FormEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

interface CustomNumberInputProps extends Omit<NumberInputProps, 'elementProps' | 'renderDefault'> {
  elementProps: CustomInputElementProps;
  renderDefault: (props: NumberInputProps) => ReactNode;
  parent?: {
    capacity?: string;
    grade?: string;
  };
}

export default defineType({
  name: 'iphoneAttributes',
  title: 'iPhone Attributes',
  type: 'object',
  fields: [
    defineField({
      name: 'model',
      title: 'Model',
      type: 'string',
      options: {
        list: [
          { title: 'iPhone 15 Pro Max', value: 'iphone_15_pro_max' },
          { title: 'iPhone 15 Pro', value: 'iphone_15_pro' },
          { title: 'iPhone 15 Plus', value: 'iphone_15_plus' },
          { title: 'iPhone 15', value: 'iphone_15' },
          { title: 'iPhone 14 Pro Max', value: 'iphone_14_pro_max' },
          { title: 'iPhone 14 Pro', value: 'iphone_14_pro' },
          { title: 'iPhone 14 Plus', value: 'iphone_14_plus' },
          { title: 'iPhone 14', value: 'iphone_14' },
          { title: 'iPhone 13 Pro Max', value: 'iphone_13_pro_max' },
          { title: 'iPhone 13 Pro', value: 'iphone_13_pro' },
          { title: 'iPhone 13', value: 'iphone_13' },
          { title: 'iPhone 13 mini', value: 'iphone_13_mini' },
          { title: 'iPhone 12 Pro Max', value: 'iphone_12_pro_max' },
          { title: 'iPhone 12 Pro', value: 'iphone_12_pro' },
          { title: 'iPhone 12', value: 'iphone_12' },
          { title: 'iPhone 12 mini', value: 'iphone_12_mini' },
          { title: 'iPhone SE (2nd/3rd gen)', value: 'iphone_se' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'colorVariants',
      title: 'Color Variants',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'color',
              title: 'Color',
              type: 'string',
              options: {
                list: [
                  { title: 'Space Black', value: 'space_black' },
                  { title: 'Silver', value: 'silver' },
                  { title: 'Gold', value: 'gold' },
                  { title: 'Graphite', value: 'graphite' },
                  { title: 'Sierra Blue', value: 'sierra_blue' },
                  { title: 'Alpine Green', value: 'alpine_green' },
                  { title: 'Deep Purple', value: 'deep_purple' },
                  { title: 'Product Red', value: 'product_red' },
                  { title: 'Blue', value: 'blue' },
                  { title: 'Midnight', value: 'midnight' },
                  { title: 'Starlight', value: 'starlight' },
                  { title: 'Pink', value: 'pink' },
                  { title: 'Purple', value: 'purple' },
                  { title: 'Yellow', value: 'yellow' },
                  { title: 'Coral', value: 'coral' },
                ],
                layout: 'dropdown',
              },
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: 'quantity',
              title: 'Total Quantity in Stock',
              type: 'number',
              description: 'Total quantity available across all storage options',
              initialValue: 0,
              validation: (Rule: any) => Rule.min(0).integer().required(),
            }),
            defineField({
              name: 'priceAdjustment',
              title: 'Price Adjustment (ZAR)',
              type: 'number',
              description: 'Additional amount to add to base price for this color',
              initialValue: 0,
            }),
            defineField({
              name: 'images',
              title: 'Color-Specific Images',
              type: 'array',
              of: [{ type: 'image' }],
              options: {
                layout: 'grid',
              },
            }),
            defineField({
              name: 'storageOptions',
              title: 'Storage Options & Inventory',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'capacity',
                      title: 'Storage Capacity',
                      type: 'string',
                      options: {
                        list: [
                          { title: '64GB', value: '64gb' },
                          { title: '128GB', value: '128gb' },
                          { title: '256GB', value: '256gb' },
                        ],
                        layout: 'dropdown',
                      },
                      validation: (Rule: any) => Rule.required(),
                    }),
                    defineField({
                      name: 'storagePriceAdjustment',
                      title: 'Price Adjustment (ZAR)',
                      type: 'number',
                      description: 'Additional amount to add to base price for this storage option',
                      initialValue: 0,
                      components: {
                        input: function StoragePriceInput(props: any) {
                          const storageSize = props.parent?.capacity;
                          const defaultAdjustments: Record<string, number> = {
                            '64gb': 0,
                            '128gb': 500,
                            '256gb': 1000,
                          };
                          
                          // Set default value based on storage size
                          if (storageSize && props.elementProps.value === undefined) {
                            const defaultValue = defaultAdjustments[storageSize] || 0;
                            if (props.elementProps.onChange) {
                              const event = {
                                currentTarget: { value: defaultValue.toString() },
                                preventDefault: () => {},
                                stopPropagation: () => {},
                              } as unknown as ChangeEvent<HTMLInputElement>;
                              props.elementProps.onChange(event);
                            }
                          }
                          
                          const placeholder = storageSize 
                            ? `Default: R${defaultAdjustments[storageSize] || 0}` 
                            : 'Enter adjustment';
                          
                          const elementProps = {
                            ...props.elementProps,
                            value: props.elementProps.value?.toString() || '',
                            placeholder,
                          };
                          
                          return props.renderDefault({
                            ...props,
                            elementProps,
                          });
                        },
                      },
                    }),
                    defineField({
                      name: 'batteryGrades',
                      title: 'Battery Grade Options',
                      type: 'array',
                      of: [
                        {
                          type: 'object',
                          fields: [
                            defineField({
                              name: 'grade',
                              title: 'Battery Grade',
                              type: 'string',
                              options: {
                                list: [
                                  { title: 'Grade A (90-100% capacity)', value: 'grade_a' },
                                  { title: 'Grade B (80-89% capacity)', value: 'grade_b' },
                                  { title: 'Grade C (70-79% capacity)', value: 'grade_c' },
                                ],
                                layout: 'dropdown',
                              },
                              validation: (Rule: any) => Rule.required(),
                            }),
                            defineField({
                              name: 'quantity',
                              title: 'Quantity in Stock',
                              type: 'number',
                              initialValue: 0,
                              validation: (Rule: any) => Rule.min(0).integer().required(),
                            }),
                            defineField({
                              name: 'batteryPriceAdjustment',
                              title: 'Price Adjustment (ZAR)',
                              type: 'number',
                              description: 'Additional adjustment for this battery grade',
                              initialValue: 0,
                              components: {
                                input: function BatteryPriceInput(props: any) {
                                  const batteryGrade = props.parent?.grade;
                                  const defaultAdjustments: Record<string, number> = {
                                    grade_a: 1000,
                                    grade_b: 500,
                                    grade_c: 0,
                                  };
                                  
                                  // Set default value based on battery grade
                                  if (batteryGrade && props.elementProps.value === undefined) {
                                    const defaultValue = defaultAdjustments[batteryGrade] || 0;
                                    if (props.elementProps.onChange) {
                                      const event = {
                                        currentTarget: { value: defaultValue.toString() },
                                        preventDefault: () => {},
                                        stopPropagation: () => {},
                                      } as unknown as ChangeEvent<HTMLInputElement>;
                                      props.elementProps.onChange(event);
                                    }
                                  }
                                  
                                  const placeholder = batteryGrade 
                                    ? `Default: R${defaultAdjustments[batteryGrade] || 0}` 
                                    : 'Enter adjustment';
                                  
                                  const elementProps = {
                                    ...props.elementProps,
                                    value: props.elementProps.value?.toString() || '',
                                    placeholder,
                                  };
                                  
                                  return props.renderDefault({
                                    ...props,
                                    elementProps,
                                  });
                                },
                              },
                            }),
                            defineField({
                              name: 'healthPercentage',
                              title: 'Battery Health %',
                              type: 'number',
                              description: 'Current battery health percentage',
                              validation: (Rule: any) => 
                                Rule
                                  .min(0)
                                  .max(100)
                                  .precision(0)
                                  .custom((value: number, context: any) => {
                                    if (value === undefined) return 'Battery health is required';
                                    const grade = context.parent?.grade;
                                    
                                    const gradeRanges: Record<string, { min: number; max: number }> = {
                                      grade_a: { min: 90, max: 100 },
                                      grade_b: { min: 80, max: 89 },
                                      grade_c: { min: 70, max: 79 },
                                    };

                                    const range = gradeRanges[grade];
                                    
                                    if (!range) return true;
                                    
                                    if (value < range.min || value > range.max) {
                                      return `Health must be ${range.min}-${range.max}% for selected grade`;
                                    }
                                    
                                    return true;
                                  }),
                            }),
                          ],
                          preview: {
                            select: {
                              grade: 'grade',
                              health: 'healthPercentage',
                              qty: 'quantity',
                              adj: 'batteryPriceAdjustment',
                            },
                            prepare: (selection: any) => {
                              const { grade, health, qty, adj } = selection;
                              const gradeTitles: Record<string, string> = {
                                grade_a: 'A',
                                grade_b: 'B',
                                grade_c: 'C',
                              };
                              
                              const adjText = adj ? (adj > 0 ? ` (+R${adj})` : ` (R${adj})`) : '';
                              
                              return {
                                title: `Battery ${gradeTitles[grade] || grade} (${health}%)`,
                                subtitle: `Qty: ${qty}${adjText}`,
                              };
                            },
                          },
                        },
                      ],
                      validation: (Rule: any) => Rule.min(1).max(3).unique('grade'),
                    }),
                  ],
                  preview: {
                    select: {
                      capacity: 'capacity',
                      grades: 'batteryGrades',
                      adj: 'storagePriceAdjustment',
                    },
                    prepare: (selection: any) => {
                      const { capacity, grades = [], adj } = selection;
                      const totalQty = (grades as any[]).reduce((sum: number, g: any) => sum + (g.quantity || 0), 0);
                      const adjText = adj ? (adj > 0 ? ` (+R${adj})` : ` (R${adj})`) : '';
                      
                      return {
                        title: `${capacity}${adjText}`,
                        subtitle: `${grades.length} battery grades, ${totalQty} total in stock`,
                      };
                    },
                  },
                },
              ],
              validation: (Rule: any) => Rule.min(1).unique('capacity'),
            }),
          ],
          preview: {
            select: {
              color: 'color',
              quantity: 'quantity',
              adj: 'priceAdjustment',
              media: 'images.0',
            },
            prepare: (selection: any) => {
              const { color, quantity, adj, media } = selection;
              const adjText = adj ? (adj > 0 ? ` (+R${adj})` : ` (R${adj})`) : '';
              
              return {
                title: color ? color.replace(/_/g, ' ') : 'No color selected',
                subtitle: `Qty: ${quantity}${adjText}`,
                media,
              };
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.min(1).unique('color'),
    }),
    defineField({
      name: 'condition',
      title: 'Condition',
      type: 'string',
      options: {
        list: [
          { title: 'Brand New (Sealed)', value: 'brand_new_sealed' },
          { title: 'Brand New (Open Box)', value: 'brand_new_open_box' },
          { title: 'Refurbished - Like New', value: 'refurbished_like_new' },
          { title: 'Refurbished - Good', value: 'refurbished_good' },
          { title: 'Used - Like New', value: 'used_like_new' },
          { title: 'Used - Good', value: 'used_good' },
          { title: 'Used - Fair', value: 'used_fair' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'brand_new_sealed',
    }),
    defineField({
      name: 'network',
      title: 'Network',
      type: 'string',
      options: {
        list: [
          { title: 'Unlocked', value: 'unlocked' },
          { title: 'Vodacom', value: 'vodacom' },
          { title: 'MTN', value: 'mtn' },
          { title: 'Cell C', value: 'cell_c' },
          { title: 'Telkom', value: 'telkom' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'unlocked',
    }),
    defineField({
      name: 'warranty',
      title: 'Warranty',
      type: 'string',
      description: 'Warranty information',
      initialValue: '1 year seller warranty',
    }),
    defineField({
      name: 'imei',
      title: 'IMEI Number',
      type: 'string',
      description: 'International Mobile Equipment Identity number',
    }),
    defineField({
      name: 'includes',
      title: 'What\'s Included',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Original Box', value: 'original_box' },
          { title: 'Charging Cable', value: 'charging_cable' },
          { title: 'Power Adapter', value: 'power_adapter' },
          { title: 'EarPods', value: 'earpods' },
          { title: 'SIM Ejector Tool', value: 'sim_tool' },
          { title: 'User Manual', value: 'manual' },
          { title: 'Original Receipt', value: 'receipt' },
        ],
        layout: 'grid',
      },
    }),
  ],
});
