// Fruits et légumes de saison (France), mis en avant sur le tableau de bord.
const PRODUCE: Record<number, readonly string[]> = {
  1: ['Poireau', 'Endive', 'Chou', 'Orange'],
  2: ['Poireau', 'Endive', 'Chou-fleur', 'Kiwi'],
  3: ['Poireau', 'Épinard', 'Radis', 'Pomme'],
  4: ['Asperge', 'Radis', 'Épinard', 'Fraise'],
  5: ['Asperge', 'Petit pois', 'Fraise', 'Radis'],
  6: ['Courgette', 'Tomate', 'Fraise', 'Cerise'],
  7: ['Tomate', 'Courgette', 'Aubergine', 'Pêche'],
  8: ['Tomate', 'Poivron', 'Melon', 'Prune'],
  9: ['Courge', 'Poivron', 'Raisin', 'Figue'],
  10: ['Potimarron', 'Champignon', 'Pomme', 'Poire'],
  11: ['Potimarron', 'Poireau', 'Pomme', 'Châtaigne'],
  12: ['Chou', 'Céleri', 'Clémentine', 'Châtaigne'],
};

export function seasonalProduce(month: number): readonly string[] {
  return PRODUCE[month] ?? [];
}
