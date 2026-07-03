import HeroBanner from '../components/HeroBanner.jsx';
import FeatureStrip from '../components/home/FeatureStrip.jsx';
import FeaturedPlants from '../components/FeaturedPlants.jsx';
import WhyUs from '../components/home/WhyUs.jsx';
import StatsBand from '../components/home/StatsBand.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import CategoryGrid from '../components/CategoryGrid.jsx';
import NewsletterCTA from '../components/home/NewsletterCTA.jsx';

export default function Home() {
  return (
    <>
      <HeroBanner />
      <FeatureStrip />
      <FeaturedPlants />
      <WhyUs />
      <StatsBand />
      <Testimonials />
      <CategoryGrid />
      <NewsletterCTA />
    </>
  );
}
