'use client'

import { useAnimationStore } from '@/store/useAnimationStore'

import { Button } from './ui/button'
import { Field, FieldDescription, FieldLabel } from './ui/field'
import { Slider } from './ui/slider'

export const AnimationPanel = () => {
	const animationDelaySec = useAnimationStore(state => state.animationDelaySec)
	const setAnimationDelaySec = useAnimationStore(state => state.setAnimationDelaySec)
	const incrementAnimationToken = useAnimationStore(state => state.incrementAnimationToken)

	return (
		<div className="rounded-2xl border bg-card p-4 shadow-sm print:hidden">
			<h2 className="text-sm font-medium text-muted-foreground">Animación</h2>
			<div className="mt-3 space-y-4">
				<Field>
					<FieldLabel>Velocidad de animación</FieldLabel>
					<Slider
						value={[animationDelaySec]}
						min={0.1}
						max={1}
						step={0.1}
						onValueChange={values => setAnimationDelaySec(values[0])}
					/>
					<FieldDescription>{animationDelaySec.toFixed(1)} s por paso</FieldDescription>
				</Field>
				<div className="grid gap-2 sm:grid-cols-2">
					<Button className="w-full" onClick={incrementAnimationToken}>
						Redibujar animación
					</Button>
				</div>
			</div>
		</div>
	)
}
