'use client';

export default function About() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-primary-500 mb-6">About CheckFDG</h2>
      
      <div className="bg-dark-800 rounded-lg p-6 space-y-6">
        <section>
          <h3 className="text-xl font-medium text-primary-400 mb-3">What is CheckFDG?</h3>
          <p className="text-dark-200">
            CheckFDG is an inventory value calculator for Fat Duck Gaming, designed to help players quickly determine the total sellable value of their in-game items. Simply paste your inventory list, and our calculator will instantly provide you with accurate values for each item and a total sellable inventory worth.
          </p>
        </section>
        
        <section>
          <h3 className="text-xl font-medium text-primary-400 mb-3">Features</h3>
          <ul className="list-disc pl-5 text-dark-200 space-y-2">
            <li>Instant calculation of your entire inventory value</li>
            <li>Item-by-item breakdown with individual values</li>
            <li>Support for all standard in-game items</li>
            <li>History tracking of previous inventory checks</li>
            <li>Discord bot integration for in-server calculations</li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-xl font-medium text-primary-400 mb-3">How to Use</h3>
          <ol className="list-decimal pl-5 text-dark-200 space-y-2">
            <li>Navigate to the <span className="text-primary-300">Inventory Check</span> tab</li>
            <li>Paste your inventory list (items and quantities separated by tabs)</li>
            <li>Click "Calculate Value" to get instant results</li>
            <li>Check the <span className="text-primary-300">History</span> tab to view previous calculations</li>
            <li>Use the <span className="text-primary-300">Item Lookup</span> tab to search for specific item values</li>
          </ol>
        </section>
        
        <section>
          <h3 className="text-xl font-medium text-primary-400 mb-3">Pricing Updates</h3>
          <p className="text-dark-200">
            Item prices are regularly updated to reflect current in-game values. If you notice any outdated prices or missing items, please use the <span className="text-primary-300">"item not displaying correct price or want an item added?"</span> to notify our team. Please be patient as this website is community run and will get updated at minimum once a week.
          </p>
        </section>
        
        <section>
          <h3 className="text-xl font-medium text-primary-400 mb-3">Pricing Details</h3>
          <p className="text-dark-200">
            Please note these prices only include sellable items &amp; pricing to shops in game and not fair market value. They also do not include syndicated vendor prices as we feel this is something you should find out in character. The calculator is designed to show base shop values only to help determine if you should sell or keep said items from car parts or house robberys.  
          </p>
        </section>
        
        <section className="pt-2">
          <h3 className="text-xl font-medium text-primary-400 mb-3">Discord Integration</h3>
          <div className="flex flex-col md:flex-row items-center gap-6 bg-dark-700 p-4 rounded-lg">
            <div className="text-dark-200">
              <p className="mb-3">Use our Discord bot to calculate inventory values directly in your server!</p>
              <p className="mb-2">Available commands:</p>
              <ul className="list-disc pl-5 mb-3">
                <li><code className="bg-dark-600 px-2 py-1 rounded text-primary-300">/checkinventory</code> - Calculate your inventory value</li>
                <li><code className="bg-dark-600 px-2 py-1 rounded text-primary-300">/itemprice</code> - Look up price of specific items</li>
                <li><code className="bg-dark-600 px-2 py-1 rounded text-primary-300">/requpdate</code> - Request an item price update</li>
              </ul>
            </div>
            <a
              href="https://discord.com/oauth2/authorize?client_id=1363788415480631316&permissions=0&integration_type=0&scope=bot"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#5865F2] text-white rounded-md hover:bg-[#4752c4] focus:outline-none focus:ring-0 inline-flex items-center whitespace-nowrap"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="currentColor"/>
              </svg>
              Add To Discord
            </a>
          </div>
        </section>
      </div>
    </div>
  );
} 