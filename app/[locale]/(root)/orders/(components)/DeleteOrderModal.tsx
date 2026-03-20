'use client'
import st from '../orders.module.scss'
import Image from 'next/image'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
  message: string | null
  error: string | null
  orderTitle?: string
  t: (key: string) => string
}

export default function DeleteOrderModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  message,
  error,
  orderTitle,
  t,
}: Props) {
  if (!isOpen) return null

  return (
    <div className={st.modalWrapp}>
      <div className={st.modal}>
        <Image
          src="/close.png"
          width={30}
          height={30}
          alt="close"
          onClick={onClose}
          className={st.modal__close}
        />

        <div className={st.modal__top}>
          <div className={st.modal__header}>{t('confirmDeleteOrder')}</div>
          <div className={st.modal__item}>{orderTitle}</div>

          {message && (
            <div className={st.success}>
              <Image src="/success.png" width={20} height={20} alt="success" />
              {message}
            </div>
          )}

          {error && (
            <div className={st.error}>
              <Image src="/cross.png" width={20} height={20} alt="error" />
              {error}
            </div>
          )}
        </div>

        <div className={st.modal__bottom}>
          <button type="button" className={st.modal__cancel} onClick={onClose}>
            {t('cancel')}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className={st.modal__delete}
          >
            {isDeleting ? t('deleting') : t('delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
