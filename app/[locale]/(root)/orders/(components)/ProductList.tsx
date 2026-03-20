'use client'

import st from '../orders.module.scss'

interface Product {
  id: number
  title: string
}

interface Props {
  availableProducts: Product[]
  selectedProducts: number[]
  toggleProduct: (id: number) => void
  handleAddProductsToOrder: () => void
  t: (key: string) => string
}

export default function ProductList({
  availableProducts,
  selectedProducts,
  toggleProduct,
  handleAddProductsToOrder,
  t,
}: Props) {
  return (
    <div className={st.addProd__prodList}>
      {availableProducts.length === 0 ? (
        <div className={st.addProd__empty}>{t('emptyList')}</div>
      ) : (
        <>
          {availableProducts.map((product) => (
            <div key={product.id}>
              <label className={st.addProd__label}>
                <input
                  className={st.addProd__checkbox}
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => toggleProduct(product.id)}
                />
                {product.title}
              </label>
            </div>
          ))}

          <div
            className={st.addProd__addProdButton}
            onClick={handleAddProductsToOrder}
          >
            {t('add')}
          </div>
        </>
      )}
    </div>
  )
}
