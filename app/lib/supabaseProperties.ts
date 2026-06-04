import supabaseServer from '../DB/supabaseServer'
import type { Property } from './properties'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Property {
  return {
    id:          row.id,
    title:       row.title,
    location:    row.location,
    city:        row.city,
    price:       row.price,
    priceNum:    row.price_num,
    type:        row.type,
    beds:        row.beds,
    baths:       row.baths,
    area:        row.area,
    image:       row.image,
    images:      row.images ?? [],
    badge:       row.badge,
    badgeColor:  row.badge_color,
    description: row.description,
    features:    row.features ?? [],
  }
}

export async function getProperties(): Promise<Property[]> {
  const { data, error } = await supabaseServer
    .from('properties')
    .select('*')
    .order('price_num', { ascending: false })
  if (error || !data) return []
  return data.map(mapRow)
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const { data, error } = await supabaseServer
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .order('price_num', { ascending: false })
  if (error || !data) return []
  return data.map(mapRow)
}

export async function getProperty(id: string): Promise<Property | null> {
  const { data, error } = await supabaseServer
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()
  if (error || !data) return null
  return mapRow(data)
}

export async function getSimilarProperties(id: string, type: string): Promise<Property[]> {
  const { data, error } = await supabaseServer
    .from('properties')
    .select('*')
    .neq('id', id)
    .eq('type', type)
    .limit(3)
  if (error || !data) return []
  return data.map(mapRow)
}
