'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'

export async function togglePokemonCapture(id: number, currentStatus: boolean) {
	try {
		await prisma.pokemon.update({
			where: { id },
			data: {
				isCaptured: !currentStatus,
				capturedAt: !currentStatus ? new Date() : null,
			},
		})

		revalidatePath('/')
	} catch (error) {
		console.error('Falha ao atualizar o Pokémon:', error)
	}
}
