import { prisma } from '@/lib/prisma'

export interface AICaptionOptions {
  organizationId: string
  propertyTitle?: string
  location?: string
  price?: string
  topic?: string
  platform?: string
}

export async function generateAICaption(options: AICaptionOptions): Promise<string> {
  const settings = await prisma.integrationSettings.findUnique({
    where: { organizationId: options.organizationId },
  })

  const apiKey = settings?.openaiApiKey || process.env.OPENAI_API_KEY

  if (!apiKey) {
    // Elegant fallbacks for real estate social media posts
    const location = options.location || 'Gurgaon'
    const prop = options.propertyTitle || 'Luxury 3BHK Apartment'
    const platform = options.platform || 'Instagram'

    return `✨ Unveiling Luxury Living in ${location}! ✨\n\n🏡 ${prop}\n📍 Prime Location | Modern Amenities | Exclusive Clubhouse\n💰 Special Price Offer Available Now!\n\nElevate your lifestyle with high ceilings, lush green views, and world-class connectivity.\n\n📲 Call us today or DM for private site visits & brochure!\n\n#GurgaonRealEstate #${platform.replace(/\s+/g, '')} #LuxuryApartments #EstateFlow #HomeInspiration`
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert real estate copywriter specializing in viral Instagram, Facebook, and LinkedIn posts.',
          },
          {
            role: 'user',
            content: `Write a high-converting ${options.platform || 'Instagram'} post caption for a property listing: ${options.propertyTitle || 'Luxury Home'} in ${options.location || 'Gurgaon'}. Price: ${options.price || 'Market Best'}. Include emojis, key call to action, and popular real estate hashtags.`,
          },
        ],
        max_tokens: 300,
      }),
    })

    const data = await res.json()
    return data.choices?.[0]?.message?.content || 'Luxury property available now in Gurgaon. Contact us for details!'
  } catch {
    return `✨ Exclusive Property Spotlight ✨\n🏡 ${options.propertyTitle || 'Luxury Residence'} in ${options.location || 'Gurgaon'}.\n\nContact EstateFlow Sales Team today for site visits!`
  }
}
