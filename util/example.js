const exampleEstimateTaxResponse = {
  documents: [
    {
      id: '5d522b889d3d9',
      items: [
        {
          id: '088c7465-e5b8-4624-a220-0d9faa82e7cb',
          price: {
            amount_inclusive: 675,
            amount_exclusive: 450,
            total_tax: 225,
            tax_rate: 0.5,
            sales_tax_summary: [
              {
                name: 'Brutal Tax',
                rate: 0.5,
                amount: 225,
                tax_class: {
                  class_id: '0',
                  name: 'Brutal Tax',
                  code: 'US',
                },
                id: 'Brutal Tax',
              },
            ],
          },
          type: 'item',
          wrapping: {
            id: 'd2675662-6326-4a23-9107-ab71fa6a21a1',
            price: {
              amount_exclusive: 5,
              amount_inclusive: 7.5,
              sales_tax_summary: [
                {
                  amount: 2.5,
                  id: '1',
                  name: 'BRUTAL TAX',
                  rate: 0.5,
                  tax_class: {
                    class_id: '6',
                    code: 'US',
                    name: 'Wrapping',
                  },
                },
              ],
              tax_rate: 0.5,
              total_tax: 2.5,
            },
            type: 'wrapping',
          },
        },
        {
          id: 'd2675662-6326-4a23-9107-ab71fa6a21a1',
          price: {
            amount_inclusive: 300,
            amount_exclusive: 200,
            total_tax: 100,
            tax_rate: 0.5,
            sales_tax_summary: [
              {
                name: 'Brutal Tax',
                rate: 0.5,
                amount: 100,
                tax_class: {
                  class_id: '0',
                  name: 'Brutal Tax',
                  code: 'US',
                },
                id: 'Brutal Tax',
              },
            ],
          },
          type: 'item',
          wrapping: {
            id: 'd2675662-6326-4a23-9107-ab71fa6a21a1',
            price: {
              amount_exclusive: 5,
              amount_inclusive: 7.5,
              sales_tax_summary: [
                {
                  amount: 2.5,
                  id: '1',
                  name: 'BRUTAL TAX',
                  rate: 0.5,
                  tax_class: {
                    class_id: '6',
                    code: 'US',
                    name: 'Wrapping',
                  },
                },
              ],
              tax_rate: 0.5,
              total_tax: 2.5,
            },
            type: 'wrapping',
          },
        },
      ],
      shipping: {
        id: '5d522b889d3d9',
        price: {
          amount_inclusive: 15,
          amount_exclusive: 10,
          total_tax: 5,
          tax_rate: 0.5,
          sales_tax_summary: [
            {
              name: 'Brutal Tax',
              rate: 0.5,
              amount: 5,
              tax_class: {
                class_id: '0',
                name: 'Brutal Tax',
                code: 'US',
              },
              id: 'Brutal Tax',
            },
          ],
        },
        type: 'shipping',
      },
      handling: {
        id: '5d522b889d3d9',
        price: {
          amount_inclusive: 0,
          amount_exclusive: 0,
          total_tax: 0,
          tax_rate: 0.5,
          sales_tax_summary: [
            {
              name: 'Brutal Tax',
              rate: 0.5,
              amount: 0,
              tax_class: {
                class_id: '0',
                name: 'Brutal Tax',
                code: 'US',
              },
              id: 'Brutal Tax',
            },
          ],
        },
        type: 'handling',
      },
    },
  ],
  id: '3f0c857e-2c55-443e-a89b-c3c4d8a29605',
};

const exampleCommitTaxResponse = {
  documents: [
    {
      external_id: 'sample-doc-123456789',
      id: 'shipping_14',
      items: [
        {
          id: 'product_13',
          price: {
            amount_inclusive: 675,
            amount_exclusive: 450,
            total_tax: 225,
            tax_rate: 0.5,
            sales_tax_summary: [
              {
                name: 'Brutal Tax',
                rate: 0.5,
                amount: 225,
                tax_class: {
                  class_id: '0',
                  name: 'Brutal Tax',
                  code: 'US',
                },
                id: 'Brutal Tax',
              },
            ],
          },
          type: 'item',
          wrapping: {
            id: 'product_14',
            price: {
              amount_exclusive: 5,
              amount_inclusive: 7.5,
              sales_tax_summary: [
                {
                  amount: 2.5,
                  id: '1',
                  name: 'BRUTAL TAX',
                  rate: 0.5,
                  tax_class: {
                    class_id: '6',
                    code: 'US',
                    name: 'Wrapping',
                  },
                },
              ],
              tax_rate: 0.5,
              total_tax: 2.5,
            },
            type: 'wrapping',
          },
        },
        {
          id: 'product_14',
          price: {
            amount_inclusive: 300,
            amount_exclusive: 200,
            total_tax: 100,
            tax_rate: 0.5,
            sales_tax_summary: [
              {
                name: 'Brutal Tax',
                rate: 0.5,
                amount: 100,
                tax_class: {
                  class_id: '0',
                  name: 'Brutal Tax',
                  code: 'US',
                },
                id: 'Brutal Tax',
              },
            ],
          },
          type: 'item',
          wrapping: {
            id: 'product_14',
            price: {
              amount_exclusive: 5,
              amount_inclusive: 7.5,
              sales_tax_summary: [
                {
                  amount: 2.5,
                  id: '1',
                  name: 'BRUTAL TAX',
                  rate: 0.5,
                  tax_class: {
                    class_id: '6',
                    code: 'US',
                    name: 'Wrapping',
                  },
                },
              ],
              tax_rate: 0.5,
              total_tax: 2.5,
            },
            type: 'wrapping',
          },
        },
      ],
      shipping: {
        id: 'shipping_14',
        price: {
          amount_inclusive: 15,
          amount_exclusive: 10,
          total_tax: 5,
          tax_rate: 0.5,
          sales_tax_summary: [
            {
              name: 'Brutal Tax',
              rate: 0.5,
              amount: 5,
              tax_class: {
                class_id: '0',
                name: 'Brutal Tax',
                code: 'US',
              },
              id: 'Brutal Tax',
            },
          ],
        },
        type: 'shipping',
      },
      handling: {
        id: 'handling_14',
        price: {
          amount_inclusive: 0,
          amount_exclusive: 0,
          total_tax: 0,
          tax_rate: 0.5,
          sales_tax_summary: [
            {
              name: 'Brutal Tax',
              rate: 0.5,
              amount: 0,
              tax_class: {
                class_id: '0',
                name: 'Brutal Tax',
                code: 'US',
              },
              id: 'Brutal Tax',
            },
          ],
        },
        type: 'handling',
      },
    },
  ],
  id: '113',
};

module.exports = { exampleEstimateTaxResponse, exampleCommitTaxResponse };
