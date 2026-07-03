import ProductCard from './ProductCard.jsx';

// Responsive auto-fill grid of ProductCards. Shared by Home (featured) and Shop.
export default function ProductGrid({ plants }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1.25rem',
      }}
    >
      {plants.map((plant) => (
        <ProductCard key={plant.plant_id} plant={plant} />
      ))}
    </div>
  );
}
