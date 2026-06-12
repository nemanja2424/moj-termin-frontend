/**
 * Service za preuzimanje liste gradova
 */

export const fetchGradovi = async () => {
  try {
    const response = await fetch('https://test.mojtermin.site/api/podesavanja/gradovi');
    const data = await response.json();

    if (data.success) {
      // Sortiraj gradove - Beograd, Niš, Novi Sad na početku
      const priorityOrder = ['Beograd', 'Niš', 'Novi Sad'];
      const sorted = data.gradovi.sort((a, b) => {
        const indexA = priorityOrder.indexOf(a.grad);
        const indexB = priorityOrder.indexOf(b.grad);
        
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.grad.localeCompare(b.grad);
      });
      
      return sorted;
    } else {
      console.error('Greška pri preuzimanju gradova:', data);
      return [];
    }
  } catch (error) {
    console.error('Greška pri preuzimanju gradova:', error);
    return [];
  }
};
