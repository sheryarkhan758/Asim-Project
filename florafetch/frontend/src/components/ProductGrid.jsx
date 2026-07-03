import ProductCard from './ProductCard.jsx';

// Responsive auto-fit grid of ProductCards. Shared by Home (featured) and Shop.
// auto-fit (not auto-fill) so a short row of cards stretches to fill the width
// instead of leaving an empty phantom column on the right.
export default function ProductGrid({ plants }) {
  return (
    <div
      className="ff-stagger"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
      }}
    >
      {plants.map((plant) => (
        <ProductCard key={plant.plant_id} plant={plant} />
      ))}
    </div>
  );
}
