import { create } from 'zustand'

interface AnimationState {
	animationDelaySec: number
	animationToken: number
	setAnimationDelaySec: (delay: number) => void
	incrementAnimationToken: () => void
}

export const useAnimationStore = create<AnimationState>(set => ({
	animationDelaySec: 0.2,
	animationToken: 0,
	setAnimationDelaySec: delay => set({ animationDelaySec: delay }),
	incrementAnimationToken: () => set(state => ({ animationToken: state.animationToken + 1 })),
}))
