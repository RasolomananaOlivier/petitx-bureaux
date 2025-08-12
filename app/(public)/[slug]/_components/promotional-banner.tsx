import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function PromotionalBanner() {
  return (
    <div className="bg-blue-600 rounded-lg p-8 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Image
              src="/avatar1.webp"
              alt="Ubiq representative"
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Écoute, transparence et réactivité
            </h3>
            <p className="text-blue-100">
              Faites équipe avec Ubiq pour trouver vos bureaux !
            </p>
          </div>
        </div>
        
        <Button
          variant="secondary"
          className="bg-white text-blue-600 hover:bg-gray-100"
        >
          Confier ma recherche
        </Button>
      </div>
    </div>
  )
}
