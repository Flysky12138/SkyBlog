'use client'

import { Drawer, DrawerProps, Sheet } from '@mui/joy'
import { toMerged } from 'es-toolkit'
import React from 'react'

export interface DrawerCoreRef {
  openToggle: (payload?: boolean) => void
}

export interface DrawerCoreProps extends Omit<DrawerProps, 'children' | 'open' | 'onClose' | 'ref'> {
  children?:
    | React.ReactNode
    | React.FC<{
        close: () => void
      }>
  component: React.FC<
    {
      onClick: React.MouseEventHandler<HTMLElement>
      onKeyDown: React.KeyboardEventHandler<HTMLElement>
    } & Pick<React.HTMLAttributes<HTMLElement>, 'role'>
  >
  disabled?: boolean
  onClose?: () => void
  onOpen?: () => void
  ref?: React.Ref<DrawerCoreRef>
}

export default function DrawerCore({ children, component: Component, disabled, onClose, onOpen, className, slotProps = {}, ref, ...props }: DrawerCoreProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleOpenToggle = (payload: boolean) => {
    if (disabled) return
    payload ? onOpen?.() : onClose?.()
    setIsOpen(payload)
  }

  const handleClose = () => {
    if (disabled) return
    handleOpenToggle(false)
    onClose?.()
  }

  React.useImperativeHandle(ref, () => ({
    openToggle: payload => handleOpenToggle(payload ?? !isOpen)
  }))

  return (
    <>
      <Component
        role="button"
        onClick={event => {
          event.stopPropagation()
          handleOpenToggle(true)
        }}
        onKeyDown={event => {
          if (event.code != 'Enter') return
          event.stopPropagation()
          handleOpenToggle(true)
        }}
      />
      <Drawer
        anchor="right"
        open={isOpen}
        slotProps={toMerged(
          {
            content: {
              sx: {
                bgcolor: 'transparent',
                boxShadow: 'none',
                p: 3
              }
            }
          },
          slotProps
        )}
        onClose={handleClose}
        {...props}
      >
        <Sheet className="s-hidden-scrollbar h-full overflow-y-auto rounded-lg p-5">
          {typeof children == 'function' ? children({ close: handleClose }) : children}
        </Sheet>
      </Drawer>
    </>
  )
}
