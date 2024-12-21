import React from 'react';
import { 
  Laptop, Trophy, Landmark, Building2, Film, Heart,
  Microscope, GraduationCap, Leaf, Utensils, Plane,
  Shirt, Car, Gamepad, Bitcoin, History
} from 'lucide-react';
import { type Category, CategoryLabels } from '@/types/categories';

interface CategoryNavProps {
  onSelect: (category: Category) => void;
  selectedCategory: Category | undefined;
}

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  technology: <Laptop className="w-4 h-4" />,
  sports: <Trophy className="w-4 h-4" />,
  politics: <Landmark className="w-4 h-4" />,
  business: <Building2 className="w-4 h-4" />,
  entertainment: <Film className="w-4 h-4" />,
  health: <Heart className="w-4 h-4" />,
  science: <Microscope className="w-4 h-4" />,
  education: <GraduationCap className="w-4 h-4" />,
  environment: <Leaf className="w-4 h-4" />,
  food: <Utensils className="w-4 h-4" />,
  travel: <Plane className="w-4 h-4" />,
  fashion: <Shirt className="w-4 h-4" />,
  automotive: <Car className="w-4 h-4" />,
  gaming: <Gamepad className="w-4 h-4" />,
  cryptocurrency: <Bitcoin className="w-4 h-4" />,
};

export function CategoryNav({ onSelect, selectedCategory }: CategoryNavProps) {
  return (
    <nav className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Categories
        </h2>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onSelect(undefined as any)}
              className={`w-full flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-300 ${
                !selectedCategory
                  ? 'bg-gradient-to-r from-primary/10 to-blue-600/10 text-primary font-medium scale-105'
                  : 'text-secondary hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
              }`}
            >
              All News
            </button>
          </li>
          {Object.entries(CategoryLabels).map(([id, label]) => (
            <li key={id}>
              <button
                onClick={() => onSelect(id as Category)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-300 ${
                  selectedCategory === id
                    ? 'bg-gradient-to-r from-primary/10 to-blue-600/10 text-primary font-medium scale-105'
                    : 'text-secondary hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                }`}
              >
                <span className={`transition-transform duration-300 ${
                  selectedCategory === id ? 'scale-110' : ''
                }`}>
                  {CATEGORY_ICONS[id as Category]}
                </span>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}