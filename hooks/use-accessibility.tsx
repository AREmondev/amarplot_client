'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

// Focus management hook
export function useFocusManagement() {
  const focusableElementsSelector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ')

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(focusableElementsSelector)
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [focusableElementsSelector])

  const restoreFocus = useCallback((previousElement: HTMLElement | null) => {
    if (previousElement && document.contains(previousElement)) {
      previousElement.focus()
    }
  }, [])

  return { trapFocus, restoreFocus }
}

// Keyboard navigation hook
export function useKeyboardNavigation({
  onEscape,
  onEnter,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  onHome,
  onEnd,
}: {
  onEscape?: () => void
  onEnter?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onHome?: () => void
  onEnd?: () => void
} = {}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onEscape?.()
          break
        case 'Enter':
          onEnter?.()
          break
        case 'ArrowUp':
          e.preventDefault()
          onArrowUp?.()
          break
        case 'ArrowDown':
          e.preventDefault()
          onArrowDown?.()
          break
        case 'ArrowLeft':
          onArrowLeft?.()
          break
        case 'ArrowRight':
          onArrowRight?.()
          break
        case 'Home':
          e.preventDefault()
          onHome?.()
          break
        case 'End':
          e.preventDefault()
          onEnd?.()
          break
      }
    },
    [onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onHome, onEnd]
  )

  return { handleKeyDown }
}

// Screen reader announcements
export function useScreenReader() {
  const [announcements, setAnnouncements] = useState<string[]>([])
  const announcementRef = useRef<HTMLDivElement>(null)

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, message])
    
    // Clear announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1))
    }, 1000)

    // Also use aria-live region
    if (announcementRef.current) {
      announcementRef.current.setAttribute('aria-live', priority)
      announcementRef.current.textContent = message
      
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = ''
        }
      }, 1000)
    }
  }, [])

  const AnnouncementRegion = useCallback(() => (
    <div
      ref={announcementRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  ), [])

  return { announce, AnnouncementRegion }
}

// Reduced motion detection
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// High contrast detection
export function useHighContrast() {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setPrefersHighContrast(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersHighContrast
}

// Skip link functionality
export function useSkipLink() {
  const skipToContent = useCallback((targetId: string) => {
    const target = document.getElementById(targetId)
    if (target) {
      target.focus()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return { skipToContent }
}

// ARIA live region management
export function useAriaLive() {
  const liveRegionRef = useRef<HTMLDivElement>(null)

  const updateLiveRegion = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute('aria-live', priority)
      liveRegionRef.current.textContent = message
    }
  }, [])

  const clearLiveRegion = useCallback(() => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = ''
    }
  }, [])

  const LiveRegion = useCallback(() => (
    <div
      ref={liveRegionRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  ), [])

  return { updateLiveRegion, clearLiveRegion, LiveRegion }
}

// Form accessibility helpers
export function useFormAccessibility() {
  const generateId = useCallback((prefix: string = 'field') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  }, [])

  const getAriaDescribedBy = useCallback((fieldId: string, hasError: boolean, hasHelp: boolean) => {
    const describedBy = []
    if (hasError) describedBy.push(`${fieldId}-error`)
    if (hasHelp) describedBy.push(`${fieldId}-help`)
    return describedBy.length > 0 ? describedBy.join(' ') : undefined
  }, [])

  const getFieldProps = useCallback(({
    id,
    label,
    error,
    helpText,
    required = false,
  }: {
    id?: string
    label: string
    error?: string
    helpText?: string
    required?: boolean
  }) => {
    const fieldId = id || generateId('field')
    const labelId = `${fieldId}-label`
    const errorId = `${fieldId}-error`
    const helpId = `${fieldId}-help`

    return {
      field: {
        id: fieldId,
        'aria-labelledby': labelId,
        'aria-describedby': getAriaDescribedBy(fieldId, !!error, !!helpText),
        'aria-invalid': !!error,
        'aria-required': required,
      },
      label: {
        id: labelId,
        htmlFor: fieldId,
      },
      error: {
        id: errorId,
        role: 'alert',
        'aria-live': 'polite' as const,
      },
      help: {
        id: helpId,
      },
    }
  }, [generateId, getAriaDescribedBy])

  return { generateId, getAriaDescribedBy, getFieldProps }
}

// Color contrast utilities
export function useColorContrast() {
  const calculateContrast = useCallback((color1: string, color2: string): number => {
    const getLuminance = (color: string): number => {
      const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0]
      const [r, g, b] = rgb.map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const lum1 = getLuminance(color1)
    const lum2 = getLuminance(color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    
    return (brightest + 0.05) / (darkest + 0.05)
  }, [])

  const meetsWCAG = useCallback((contrast: number, level: 'AA' | 'AAA' = 'AA', size: 'normal' | 'large' = 'normal'): boolean => {
    if (level === 'AAA') {
      return size === 'large' ? contrast >= 4.5 : contrast >= 7
    }
    return size === 'large' ? contrast >= 3 : contrast >= 4.5
  }, [])

  return { calculateContrast, meetsWCAG }
}

// Accessibility testing utilities
export function useA11yTesting() {
  const checkTabOrder = useCallback(() => {
    const focusableElements = document.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    
    const tabOrder = Array.from(focusableElements).map((el, index) => ({
      element: el,
      tabIndex: el.getAttribute('tabindex') || '0',
      order: index,
    }))
    
    console.table(tabOrder)
    return tabOrder
  }, [])

  const checkAriaLabels = useCallback(() => {
    const elementsNeedingLabels = document.querySelectorAll(
      'button:not([aria-label]):not([aria-labelledby]), input:not([aria-label]):not([aria-labelledby]), select:not([aria-label]):not([aria-labelledby])'
    )
    
    const unlabeledElements = Array.from(elementsNeedingLabels).filter(el => {
      const hasVisibleLabel = el.textContent?.trim() || el.querySelector('label')
      return !hasVisibleLabel
    })
    
    if (unlabeledElements.length > 0) {
      console.warn('Elements without proper labels:', unlabeledElements)
    }
    
    return unlabeledElements
  }, [])

  const checkHeadingStructure = useCallback(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const structure = Array.from(headings).map(heading => ({
      level: parseInt(heading.tagName.charAt(1)),
      text: heading.textContent?.trim(),
      element: heading,
    }))
    
    console.table(structure)
    return structure
  }, [])

  return { checkTabOrder, checkAriaLabels, checkHeadingStructure }
}