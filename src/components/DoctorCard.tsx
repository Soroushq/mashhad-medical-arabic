// File: src/components/DoctorCard.tsx
import Link from "next/link";

interface DoctorCardProps {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  image?: string;
}

export function DoctorCard({ id, name, specialty, rating, experience, image }: DoctorCardProps) {
  return (
    <Link 
      href={`/doctors/${id}`}
      className="block bg-white rounded-2xl shadow-sm border-2 border-gray-100 hover:border-mashhad-300 hover:shadow-md transition-all p-4"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {image ? (
            <img 
              src={image} 
              alt={name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-mashhad-100 to-mashhad-200 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-mashhad-700">
                {name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 mb-1 truncate">{name}</h3>
          <p className="text-sm text-gray-600 mb-2">{specialty}</p>
          
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 bg-gold-50 px-2 py-1 rounded-full">
              <span className="text-gold-500">⭐</span>
              <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
            </div>
            <div className="text-gray-500">
              {experience} سنوات خبرة
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
