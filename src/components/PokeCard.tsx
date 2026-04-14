"use client"

import Image from 'next/image'
import { useState, useTransition } from 'react'
import { Button } from './ui/button'
import { togglePokemonCapture } from '@/lib/actions'

interface PokeCardProps {
  id: number
  name: string
  types: string[]
  initialIsCaptured?: boolean
}

// Mapeamento das palavras em português para os IDs oficiais da PokéAPI
const typeToId: Record<string, number> = {
  'Normal': 1,
  'Lutador': 2,
  'Voador': 3,
  'Venenoso': 4,
  'Terra': 5,
  'Pedra': 6,
  'Inseto': 7,
  'Fantasma': 8,
  'Aço': 9,
  'Fogo': 10,
  'Água': 11,
  'Planta': 12,
  'Elétrico': 13,
  'Psíquico': 14,
  'Gelo': 15,
  'Dragão': 16,
  'Sombrio': 17,
  'Fada': 18,
}

export default function PokeCard({
  id,
  name,
  types,
  initialIsCaptured = false,
}: PokeCardProps) {
  const [isPending, startTransition] = useTransition()
  
  const [isCaptured, setIsCaptured] = useState(initialIsCaptured)

  const handleCaptureClick = () => {
    setIsCaptured(!isCaptured)
    startTransition(async () => {
      await togglePokemonCapture(id, initialIsCaptured)
    })
  }

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

  return (
    <div
      className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ${
        isCaptured
          ? 'border-green-500 bg-green-50 shadow-md'
          : 'border-gray-200 bg-gray-50 opacity-80'
      }`}
    >
      <Image
        src={imageUrl}
        alt={name}
        width={200}
        height={200}
        className={`w-32 h-32 object-contain transition-all duration-500 ${
          isCaptured ? 'grayscale-0 drop-shadow-lg' : 'grayscale'
        }`}
      />

      <span className="text-gray-400 text-sm font-bold mt-2">
        Nº {String(id).padStart(3, '0')}
      </span>

      <h3 className="text-lg font-bold capitalize text-gray-800">{name}</h3>

      {/* Seção simplificada: Mantém apenas os badges e deleta o texto */}
      <div className="flex gap-2 justify-center mt-3">
        {types.map(type => {
          const typeId = typeToId[type]
          if (!typeId) return null

          return (
            // 1. O fundo claro e o formato de pílula (rounded-full) ficam AQUI de fora!
            // bg-gray-200 ou bg-white vai preencher as letras vazadas e deixá-las nítidas.
            <div 
              key={type} 
              className="bg-gray-200 rounded-full hover:scale-105 transition-transform overflow-hidden flex items-center justify-center"
            >
              <Image 
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${typeId}.png`} 
                alt={type}
                // 2. Proporção cravada de 3:1 para a imagem encaixar 100% na pílula sem sobrar borda branca
                width={84} 
                height={28} 
                className="object-cover"
              />
            </div>
          )
        })}
      </div>

      <Button
        onClick={handleCaptureClick}
        disabled={isPending} 
        className={`mt-4 px-4 py-2 rounded-full font-semibold transition-colors ${
          isCaptured
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'bg-red-500 text-white hover:bg-red-600'
        }`}
      >
        {isCaptured ? 'Remover da Coleção' : 'Eu tenho esse!'}
      </Button>
    </div>
  )
}