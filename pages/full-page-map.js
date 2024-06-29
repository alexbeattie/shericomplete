import FullPageMap from '../components/FullPageMap';

const FullPageMapPage = () => {
  return (
    <div className="relative z-10 h-screen">
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-center">
        <h1 className="text-2xl font-fourth font-light text-slate-500">Listings</h1>
      </div>
      <div className="absolute top-0 left-0 right-0 bottom-0 mt-16">
        <FullPageMap />
      </div>
    </div>
  );
};

export default FullPageMapPage;