// components/TagsInput.tsx

import React, { useCallback } from 'react'
import { Stack, TextInput } from '@sanity/ui'
// ANTES: import { set, unset, type ArrayInputProps } from 'sanity'
// AHORA: Usamos el tipo específico 'ArrayOfPrimitivesInputProps'
import { set, unset, type ArrayOfPrimitivesInputProps } from 'sanity'

// ANTES: export function TagsInput(props: ArrayInputProps) {
// AHORA: Cambiamos al tipo correcto
export function TagsInput(props: ArrayOfPrimitivesInputProps) {
  const { elementProps, onChange, value = [] } = props

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value
    const tags = inputValue.split(',').map(tag => tag.trim()).filter(Boolean)
    
    onChange(tags.length > 0 ? set(tags) : unset())
  }, [onChange])

  return (
    <Stack space={2}>
      <TextInput
        {...elementProps}
        // Pasamos el id de elementProps al TextInput para una correcta asociación
        id={elementProps.id}
        onChange={handleChange}
        value={Array.isArray(value) ? value.join(', ') : ''}
        placeholder="Escribe etiquetas separadas por comas..."
      />
    </Stack>
  )
}