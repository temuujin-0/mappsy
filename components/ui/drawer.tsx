"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

// Drawer Root Component - Реф дамжуулах шаардлагагүй, учир нь энэ нь wrapper юм.
function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

// Drawer Trigger Component - Реф дамжуулах шаардлагагүй, учир нь энэ нь wrapper юм.
function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

// Drawer Portal Component - Реф дамжуулах шаардлагагүй, учир нь энэ нь wrapper юм.
function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

// Drawer Close Component - Реф дамжуулах шаардлагагүй, учир нь энэ нь wrapper юм.
function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

// ---
// `DrawerOverlay` компонентыг React.forwardRef-ээр орооно
// ---
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>, // Ref-ийн төрөл
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay> // Пропсын төрөл
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref} // Энд дамжуулж ирсэн ref-ийг холбоно
    data-slot="drawer-overlay"
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
      className
    )}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

// ---
// `DrawerContent` компонентыг React.forwardRef-ээр орооно
// (Хэрэв таны Radix UI-ийн суурь Dialog Primitive нь Content-д реф шаарддаг бол)
// Заримдаа Radix-д Dialog.Content нь ref шаарддаг тул үүнийг нэмэх нь зүйтэй.
// ---
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal data-slot="drawer-portal">
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref} // Энд ref-ийг дамжуулна
      data-slot="drawer-content"
      className={cn(
        "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
        "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
        "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
        "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
        "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
        className
      )}
      {...props}
    >
      <div className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = DrawerPrimitive.Content.displayName


// DrawerHeader Component - Реф дамжуулах шаардлагагүй (зөвхөн div wrapper).
function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

// DrawerFooter Component - Реф дамжуулах шаардлагагүй (зөвхөн div wrapper).
function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

// DrawerTitle Component - Реф дамжуулах шаардлагагүй, Primitive компонентын ref-ийг өөрөө зохицуулдаг.
function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  )
}

// DrawerDescription Component - Реф дамжуулах шаардлагагүй, Primitive компонентын ref-ийг өөрөө зохицуулдаг.
function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}