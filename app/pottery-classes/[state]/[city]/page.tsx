import { Metadata } from "next";
import Link from "next/link";
import { getCity, listProvidersForCity } from "@/lib/queries";
import { slugify, getStateNameFromSlug } from "@/lib/slugify";
import { formatHoursCompact } from "@/lib/formatHours";

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ state: string; city: string }> };


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city: citySlug } = await params;
  const city = await getCity(state, citySlug);
  if (!city) return { title: "City not found" };
  
  const stateName = getStateNameFromSlug(state);
  const title = `Pottery Classes in ${city.city}, ${stateName}`;
  const description = `Browse pottery studios and classes in ${city.city}, ${stateName}. Find wheel throwing, hand-building, and glazing classes near you.`;
  const canonical = `https://localpotteryclasses.com/pottery-classes/${state}/${citySlug}`;
  return { 
    title, 
    description, 
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: 'website',
    }
  };
}

export default async function CityPage({ params }: Props) {
  const { state, city: citySlug } = await params;
  const city = await getCity(state, citySlug);
  if (!city) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-porcelain to-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h1 className="text-3xl font-bold text-ink text-center mb-4">City Not Found</h1>
          <p className="text-center text-ink/60">
            We couldn't find this city in our directory. 
            <Link href="/search" className="text-teal hover:text-clay ml-2">
              Try searching instead
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const providers = await listProvidersForCity(city.city_slug, city.state_slug, 200);
  
  // Get full state name from the slug
  const fullStateName = getStateNameFromSlug(city.state_slug);

  return (
    <main className="min-h-screen bg-gradient-to-b from-porcelain to-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <Link href="/" className="text-teal hover:text-clay">
            Home
          </Link>
          <span className="mx-2 text-ink/40">/</span>
          <Link href={`/pottery-classes/${city.state_slug}`} className="text-teal hover:text-clay">
            {fullStateName}
          </Link>
          <span className="mx-2 text-ink/40">/</span>
          <span className="text-ink">{city.city}</span>
        </nav>

        <h1 className="text-4xl font-bold text-ink mb-6">
          Pottery Classes in {city.city}, {fullStateName}
        </h1>
        
        <p className="text-lg text-ink/70 mb-8 max-w-3xl">
          Discover {providers.length} pottery studio{providers.length !== 1 ? 's' : ''} and ceramic workshop{providers.length !== 1 ? 's' : ''} 
          in {city.city}. From beginner wheel throwing to advanced glazing techniques, 
          find the perfect pottery class for your skill level.
        </p>

        {providers.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-ink/60">No pottery studios found in this city yet.</p>
            <Link href="/search" className="inline-block mt-4 text-teal hover:text-clay">
              Search other cities
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {providers.map((provider: any) => (
              <div key={provider.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-sand/20">
                <Link
                  href={`/pottery-classes/${city.state_slug}/${city.city_slug}/${slugify(provider.name)}`}
                  className="block group"
                >
                  <h2 className="text-xl font-semibold text-ink group-hover:text-clay transition-colors mb-2">
                    {provider.name}
                  </h2>
                </Link>
                
                <div className="text-ink/60 space-y-1">
                  <p className="text-sm">
                    {provider.street}, {provider.city} {provider.state} {provider.postal_code}
                  </p>
                  
                  {provider.phone_number && (
                    <p className="text-sm">
                      <a href={`tel:${provider.phone_number}`} className="hover:text-teal">
                        {provider.phone_number}
                      </a>
                    </p>
                  )}
                  
                  {provider.working_hours && (
                    <p className="text-sm">
                      {formatHoursCompact(provider.working_hours)}
                    </p>
                  )}
                  
                  {provider.review_stars != null && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium text-ink">
                        {Number(provider.review_stars).toFixed(1)}
                      </span>
                      <span className="text-sm text-ink/50">
                        ({provider.review_count || 0} review{provider.review_count !== 1 ? 's' : ''})
                      </span>
                    </div>
                  )}
                </div>
                
                <Link
                  href={`/pottery-classes/${city.state_slug}/${city.city_slug}/${slugify(provider.name)}`}
                  className="inline-flex items-center gap-1 mt-4 text-teal hover:text-clay transition-colors text-sm font-medium"
                >
                  View Details
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Seattle Specific Content */}
        {city.city === "Seattle" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Seattle</h2>
              <p className="text-ink/70 leading-relaxed">
                Seattle's pottery scene is booming right now. Since 2020, new studios have opened all over the city, and most classes fill up fast - some in just 48 hours! Tech workers love pottery as a way to relax and make something with their hands. The city has famous ceramic artists at Pike Place Market, where you can see potters like Orna and Chris from CMS Ceramics selling their work. The University of Washington also has a great ceramics program that brings new ideas to the local pottery world.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Popular Neighborhoods for Pottery Classes</h2>
              <p className="text-ink/70 leading-relaxed">
                <strong>Capitol Hill</strong> has Seatown Pottery on E Aloha Street with 24/7 studio access - perfect for night owls. <strong>Fremont</strong> is home to The Clay Corner, which keeps classes small (just 5 students) and is open from 8am to 11pm every day. <strong>Ballard</strong> has Ballard Clay, a new community studio that opened in September. <strong>Georgetown</strong> hosts the Seattle Artist League, which reopened in 2022 with pottery wheels and hand-building classes. <strong>Wallingford</strong> has Saltstone Ceramics, run by queer, trans, BIPOC and women artists who make everyone feel welcome.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Classes Available</h2>
              <p className="text-ink/70 leading-relaxed">
                Seattle studios know you're busy. Many offer drop-in classes where you can try the wheel for one night. Classes run mornings, evenings, and weekends. Prices range from $30 for a single class to $300-400 for month-long courses. Some studios like Seatown let you work any time - even at 2am! Gather Pottery in Interbay has 20 wheels and lots of space. Most places offer both wheel throwing and hand-building. Kids can join family classes on weekends.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">What You'll Learn and Make</h2>
              <p className="text-ink/70 leading-relaxed">
                Start with the basics - how to center clay on the wheel and make a simple bowl. Seattle teachers often draw ideas from nature, like making pieces inspired by Mount Rainier or Puget Sound. You'll learn to make coffee mugs (perfect for Seattle's coffee culture!) and plates for dinner parties. Advanced students can try the Pacific Northwest style - mixing Japanese and Scandinavian designs that Seattle artists love. Many studios teach you to use local materials and eco-friendly glazes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Seattle</h2>
              <p className="text-ink/70 leading-relaxed">
                Pick a studio near you - with Seattle traffic, staying local helps. Most studios are near bus lines or light rail stops. The Clay Corner in Fremont has a waitlist of over 100 people, so sign up early! Visit studios first to find your favorite. Pottery Northwest offers tours to see their space. Wear clothes you don't mind getting muddy. Bring patience - learning pottery takes time, but Seattle's friendly pottery community will help you along the way.
              </p>
            </section>
          </div>
        )}

        {/* New York Specific Content */}
        {city.city === "New York" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in New York</h2>
              <p className="text-ink/70 leading-relaxed">
                New York has been teaching pottery for over 100 years. Greenwich House Pottery started in 1904 and still teaches classes today in Greenwich Village. The city has the Museum of Ceramic Art (MoCA) and the Museum of Arts and Design that show amazing pottery from around the world. You can learn pottery traditions from many cultures here - from South Asian styles to Native American techniques. Many famous artists got their start in NYC pottery studios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in New York</h2>
              <p className="text-ink/70 leading-relaxed">
                Studios are open late - some until 9pm every day. Classes start at $90 for a single session. Most studios offer 8-10 week courses that meet once a week for 3 hours. The 92NY on the Upper East Side teaches both stoneware in spring/fall and porcelain in summer. Greenwich House has classes for all levels at their Village location and new Chelsea studio. Many places offer "Sip & Spin" nights where you can bring drinks and make pottery with friends.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in New York</h2>
              <p className="text-ink/70 leading-relaxed">
                Greenwich Village has the historic Greenwich House on Jones Street. Chelsea has La Mano Pottery and Greenwich House's new space on Eighth Avenue. The Upper West Side has three great options - Supermud (teaching for 40 years), MUGI Pottery (since 1987), and Pottery Studio 1. Take the subway to any studio - they're all near train stops. Most studios let you visit first to see if you like the vibe.
              </p>
            </section>
          </div>
        )}

        {/* Brooklyn Specific Content */}
        {city.city === "Brooklyn" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Brooklyn</h2>
              <p className="text-ink/70 leading-relaxed">
                Brooklyn's pottery scene is all about community. Studios like Artshack in Bed-Stuy offer free community days for neighbors. Brooklyn Clay Industries works from the historic Navy Yard. Many studios are run by local artists who live in the neighborhood. The area attracts creative people who want a more relaxed vibe than Manhattan. Brooklyn studios often have bigger spaces since rent is cheaper than in the city.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Brooklyn</h2>
              <p className="text-ink/70 leading-relaxed">
                Clayhouse Brooklyn offers 24/7 access for serious potters. Bushwick Ceramics teaches both wheel throwing and hand-building like pinch pots and coil methods. The Painted Pot in Park Slope lets you paint pottery too. Gasworks in South Slope even has special cone 10 gas firings for advanced work. Many Brooklyn studios have kids' summer camps. Classes are often cheaper than Manhattan - starting around $70.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Brooklyn</h2>
              <p className="text-ink/70 leading-relaxed">
                Greenpoint has Wilcoxson Brooklyn Ceramics on West Street. Williamsburg is home to Maison Clay right in the heart of the neighborhood. Bushwick Ceramics offers full studio access with wheels, tools, and glazes. Park Slope families love The Painted Pot. Gasworks in South Slope gives 24/7 access to members. Most Brooklyn studios are near the L, G, or Q trains. The vibe is friendly and less rushed than Manhattan.
              </p>
            </section>
          </div>
        )}

        {/* Austin Specific Content */}
        {city.city === "Austin" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Austin</h2>
              <p className="text-ink/70 leading-relaxed">
                Austin's "Keep Austin Weird" motto extends to its pottery scene, where creativity flows as freely as the city's famous live music. Since 2000, when that slogan was born, Austin has grown into a creative powerhouse that attracts over 100,000 millennials who love making things with their hands. The city's pottery studios embrace this spirit, mixing traditional techniques with Austin's quirky artistic style. As a UNESCO Creative City, Austin supports its pottery artists through public art projects and cultural exchanges. This blend of old and new makes every pottery class here feel like you're part of something bigger - the city's mission to stay weird and wonderful.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Austin</h2>
              <p className="text-ink/70 leading-relaxed">
                Studios across Austin know that tech workers and musicians have different schedules, so they offer classes at all times. One-time classes cost $65-100, perfect for trying pottery during South by Southwest or Austin City Limits Festival. For those ready to dive deeper, 8-week courses at places like Austin Pottery on Burnet Road run $420 and include 3 hours of weekly instruction plus open studio time. East Side Pot Shop goes beyond basics with special cone 10 reduction and soda firing techniques. Meanwhile, Ceramigos on South Congress offers date night pottery sessions where couples can create together. These varied options mean whether you're a University of Texas student or a busy parent, there's a class that fits your life.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started with Pottery in Austin</h2>
              <p className="text-ink/70 leading-relaxed">
                East Austin pulses with creative energy, and that's where you'll find Broad Studios Club House and East Side Pot Shop, both known for welcoming beginners. South Congress (SoCo) hosts Ceramigos at 4930 S Congress Ave, where the artist-run studio feels more like joining a community than taking a class. For North Austin residents, Round Rock Community Clay offers intro classes for just $65 including everything you need. Most studios sit near major roads like Burnet or Congress, making them easy to reach even with Austin's notorious traffic. The outdoor-loving culture here means many potters draw inspiration from Lady Bird Lake and Zilker Park for their creations. Ready to get your hands dirty? Search our directory for pottery classes near you to find the perfect Austin studio that matches your weird and wonderful style.
              </p>
            </section>
          </div>
        )}

        {/* Chicago Specific Content */}
        {city.city === "Chicago" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Chicago</h2>
              <p className="text-ink/70 leading-relaxed">
                Chicago has supported pottery artists for decades. The Hyde Park Art Center has taught ceramics since 1939 and offers over 200 classes a year. The Art Institute of Chicago shows pottery from ancient times to today, including Maya ceramics and African pieces from the 11th century. Famous ceramic artist Ruth Duckworth worked here. The School of the Art Institute (SAIC) has one of the best experimental ceramics programs in the country.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Chicago</h2>
              <p className="text-ink/70 leading-relaxed">
                Lincoln Square Pottery Studio is a nonprofit that keeps classes affordable. Park West Ceramics in Lincoln Park has taught beginners for 27 years. Penguin Foot in Logan Square lets you bring wine to class. The Chicago Park District runs cheap ceramics programs all over the city. GnarWare in Pilsen offers 6-week classes, day workshops, or just a day pass. Hyde Park Art Center has 5 and 10-week terms with about 12 different ceramics classes each term.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Chicago</h2>
              <p className="text-ink/70 leading-relaxed">
                Lincoln Park has Park West Ceramics for beginners. Wicker Park's One Strange Bird on Division Street welcomes families. Logan Square's Penguin Foot has a relaxed vibe with good music and 5,000 square feet of space. Ravenswood is home to Lillstreet Art Center, founded in 1975. Pilsen has GnarWare Workshop on Cermak Road. Most studios are near the L train. The Chicago Park District studios are the cheapest option for beginners.
              </p>
            </section>
          </div>
        )}

        {/* San Francisco Specific Content */}
        {city.city === "San Francisco" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in San Francisco</h2>
              <p className="text-ink/70 leading-relaxed">
                San Francisco has a long history with pottery and ceramics. The city is home to famous art schools like California College of the Arts (CCA) and SF State. Many tech workers come to pottery studios to relax after work. You'll find studios in neighborhoods across the city, from the artsy Mission District to the quiet Inner Sunset. Each studio has its own style, but they all welcome beginners and experts alike.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Popular Neighborhoods for Pottery Classes</h2>
              <p className="text-ink/70 leading-relaxed">
                The <strong>Mission District</strong> is the heart of SF's art scene. You'll find The Pottery Studio on Folsom Street and Hickory Clay here. In the <strong>Richmond District</strong>, check out Mel Rice Studio on Geary Boulevard - it's run by a local artist who creates a warm, friendly space. The <strong>Inner Sunset</strong> has Earthfire Arts, perfect if you want a calm spot near Golden Gate Park. <strong>SoMa</strong> is where tech meets art, with studios like Clayroom just blocks from major tech offices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Classes Available</h2>
              <p className="text-ink/70 leading-relaxed">
                Most studios offer different ways to learn. Try a one-day class for $85-95 to see if you like it. Evening classes (7-9pm) are perfect for people with day jobs. Six-week courses cost around $400-600 and include all your materials. Some studios let members come in 24/7 to practice. You can learn wheel throwing, hand-building, or glazing. There are classes for kids, adults, and seniors.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">What You'll Learn and Make</h2>
              <p className="text-ink/70 leading-relaxed">
                Start by making simple things like bowls and mugs. Learn to center clay on the wheel - it takes practice but feels great when you get it. Teachers show you how to shape, dry, and glaze your pieces. Make gifts for friends or dishes for your home. Advanced students can try sculpture or mixed media art. Every piece you make is unique and tells your story.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in San Francisco</h2>
              <p className="text-ink/70 leading-relaxed">
                Pick a studio near your home or work - parking is hard in SF, so being close to BART or MUNI helps. City rec centers offer cheap classes starting at $150. Private studios cost more but give you more time and attention. Most places let you visit before signing up. Bring old clothes that can get dirty. Just show up ready to learn and have fun with clay!
              </p>
            </section>
          </div>
        )}

        {/* San Diego Specific Content */}
        {city.city === "San Diego" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in San Diego</h2>
              <p className="text-ink/70 leading-relaxed">
                San Diego has studios from the beach to the desert, each with its own vibe. North Park and University Heights are the heart of the arts scene with galleries and studios on every corner. The city has over 30 pottery studios including the famous Mud Lily on Adams Avenue. UC San Diego's Craft Center has been teaching ceramics since the 1970s with 20 wheels and huge kilns. Many studios have outdoor spaces where you can work in the perfect weather San Diego is known for.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in San Diego</h2>
              <p className="text-ink/70 leading-relaxed">
                Take a single "taste of ceramics" class for $75-90 or sign up for 5-week courses. Many studios offer 24/7 access for members who want to work on their own schedule. Teralta Art in City Heights has affordable classes for all ages as a nonprofit. Cool Creations in Pacific Beach combines pottery wheel classes with paint-your-own options. Private party packages can host up to 30 people - perfect for birthdays or team building. Students often get one free month of membership after finishing a course.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in San Diego</h2>
              <p className="text-ink/70 leading-relaxed">
                North Park has Mud Lily and Clay Associates right on Adams Avenue. Head to Pacific Beach for Cool Creations near the ocean. City Heights offers Teralta Art with low-cost classes. La Jolla has the UCSD Craft Center with tons of equipment. Balboa Park area has ICA and Ceramic Heights with special workshops. Most studios are easy to reach by car with parking, unlike some other big cities. The weather is perfect year-round for working with clay. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Los Angeles Specific Content */}
        {city.city === "Los Angeles" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Los Angeles</h2>
              <p className="text-ink/70 leading-relaxed">
                LA's pottery scene matches the city - creative, diverse, and always growing. Echo Park and Silver Lake are packed with studios like POT Studio and Claytivity. The arts district downtown has Still Life Ceramics in a converted warehouse. Venice and the west side offer beachy vibes at studios like Echo Art Studio in Palms. With year-round sunshine, many studios have outdoor spaces and natural light from huge skylights. LA attracts ceramic artists from around the world who teach unique styles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Los Angeles</h2>
              <p className="text-ink/70 leading-relaxed">
                Classes range from $50 drop-in sessions to $400 for 6-week courses. Silver Lake's Cobalt & Clay offers 5-day Clay Camps for kids during school breaks. Many studios have "date night" pottery where couples can create together. Good Dirt LA focuses on small, intimate classes with lots of personal attention. Studios stay open late - perfect for fitting pottery around LA traffic and work schedules. Most places include clay, glazes, and two firings in the class price.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Los Angeles</h2>
              <p className="text-ink/70 leading-relaxed">
                Echo Park has POT Studio right in the neighborhood's heart. Silver Lake offers Claytivity and Cobalt & Clay near trendy shops and cafes. Downtown artists love Still Life Ceramics DTLA for its community vibe. West siders can try Echo Art Studio in Palms or The Pottery Studio in Culver City. Most studios are near Metro stops, but having a car helps in spread-out LA. Visit during off-peak hours to avoid traffic. Many studios offer free first-time trials or studio tours. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Portland Specific Content */}
        {city.city === "Portland" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Portland</h2>
              <p className="text-ink/70 leading-relaxed">
                Portland's maker community loves working with their hands, and pottery fits right in. The city has tons of community studios where artists share space and ideas. Southeast Portland is the ceramics hub with studios like Radius on Belmont and The Mud Room on 10th Avenue. The Alberta Arts District adds color with studios like Mimosa. The Oregon Potters Association connects ceramicists across the city. Many Portland potters focus on functional pieces - mugs for coffee, bowls for farm-to-table meals.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Portland</h2>
              <p className="text-ink/70 leading-relaxed">
                Portland studios offer flexible options - monthly memberships with 24/7 access or drop-in classes. Radius Studio has hourly rentals if you just need wheel time. The Multnomah Arts Center runs affordable classes year-round for all ages. St. Johns Clay Collective in North Portland welcomes beginners with patient teachers. Morning Ceramics offers everything from one-time workshops to full memberships. Many studios host "clay dates" and serve local beer or kombucha during evening classes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Portland</h2>
              <p className="text-ink/70 leading-relaxed">
                Southeast Portland has the most options - check out Radius on Belmont or The Mud Room on 10th. Alberta Arts District offers Mimosa Studios for paint-your-own pottery. St. Johns has the Clay Collective with great community vibes. The Pearl District is close to several studios in Northwest. Most studios are bike-friendly with good transit access. Portland's rainy weather makes indoor pottery the perfect year-round activity. Studios here focus on sustainability with recycled clay and eco-friendly glazes. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Denver Specific Content */}
        {city.city === "Denver" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Denver</h2>
              <p className="text-ink/70 leading-relaxed">
                Denver's mile-high arts scene includes a strong pottery community. The RiNo Art District has Plinth Gallery, winner of the Mayor's Design Award for ceramics. Santa Fe Art District houses Artists on Santa Fe with 25+ working artist studios you can visit. The Colorado Potters Guild brings ceramicists together from across the metro area. Urban Mud was created to build community among potters of all backgrounds. Denver's dry climate means clay dries fast - studios teach special techniques for working at altitude.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Denver</h2>
              <p className="text-ink/70 leading-relaxed">
                Take classes at Denver Parks and Recreation centers for budget-friendly options. Stone Bear Studios near Denver teaches wheel throwing, hand-building, and glazing for all levels. Arts on Fire in Highlands Ranch and Castle Rock never charges studio fees for paint-your-own pottery. The Art Students League of Denver on Grant Street offers serious ceramic training. Old Santa Fe Pottery is open 7 days a week for shopping and inspiration. Many studios offer workshops on special techniques like raku firing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Denver</h2>
              <p className="text-ink/70 leading-relaxed">
                RiNo Art District is perfect for checking out Plinth Gallery and other creative spaces. The Santa Fe Art District on Santa Fe Drive has multiple studios in converted warehouses. Highland has easy access to several studios with parking. Metro Denver offers Stone Bear Studios with hands-on classes. Most studios are car-friendly with good parking, important for hauling pottery home. Denver's 300 days of sunshine mean great natural light in studios. The creative community here is welcoming to beginners. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Nashville Specific Content */}
        {city.city === "Nashville" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Nashville</h2>
              <p className="text-ink/70 leading-relaxed">
                Nashville's creative scene goes beyond music - the pottery community is thriving too. Germantown's historic 100 Taylor Arts Collective houses Handmade Studio TN, called the best pottery class in town. Ceramic Souls is Nashville's first 24/7 pottery-only studio for serious makers. Metro Parks runs three pottery studios including the popular Centennial Art Center. Old School Farm brings pottery to downtown in a refurbished warehouse. The city's artistic energy and Southern hospitality create a welcoming pottery scene.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Nashville</h2>
              <p className="text-ink/70 leading-relaxed">
                Handmade Studio TN offers 6-week courses covering everything from hand-building to glazing. Nashville Pottery has weekly series plus special date night experiences combining wheel work and hand-building. Metro Parks provides affordable beginner classes at three locations across the city. Ceramic Souls gives 24/7 access to members who want to work on their own time. Private workshops can host 2 to 40 people for parties or team events. Classes range from $30 for Metro Parks sessions to $300+ for private studio courses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Nashville</h2>
              <p className="text-ink/70 leading-relaxed">
                Germantown's 100 Taylor Arts Collective is a creative hub with coffee and flowers alongside pottery. East Nashville artists love the community vibe at local studios. Centennial Park's Art Center offers convenient midtown location with easy parking. Old School Farm downtown works for people living or working in the city center. Most studios have parking, important in spread-out Nashville. The friendly Southern culture means studios feel like family. Many offer trial classes or open houses to find your fit. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Miami Specific Content */}
        {city.city === "Miami" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Miami</h2>
              <p className="text-ink/70 leading-relaxed">
                Miami's pottery scene matches its vibrant art culture. Wynwood, famous for street art, now has multiple ceramics studios including OCISLY's tropical oasis with music and clay. The Ceramic League of Miami has been the city's premier ceramic arts center for years. Little Havana, Coconut Grove, and the Design District each offer unique pottery experiences. The warm weather means studios can have open-air spaces year-round. Miami's Latin influence shows up in colorful glazes and bold designs that reflect the city's energy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Miami</h2>
              <p className="text-ink/70 leading-relaxed">
                Classes start at $75-100 per person with group discounts available. Pottery Studio 1 in Wynwood offers daily classes from $90. OCISLY has wheel throwing for beginners plus sculpting workshops. The Ceramic League teaches everything - wheel throwing, hand-building, raku, and mosaics. Many studios offer date nights and private parties perfect for Miami's social scene. Kids can join art classes at studios like Art Classes Wynwood. Most places include materials and firings in the price.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Miami</h2>
              <p className="text-ink/70 leading-relaxed">
                Wynwood is the pottery hot spot with multiple studios on NW 36th Street. The Design District and Little Haiti have creative spaces too. Coconut Grove offers a more relaxed vibe for learning. Coral Gables has upscale studios in beautiful settings. Most studios have parking which helps in car-dependent Miami. The tropical climate means clay stays moist and workable. Many studios blend art with Miami's party culture - expect good music and fun vibes. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Philadelphia Specific Content */}
        {city.city === "Philadelphia" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Philadelphia</h2>
              <p className="text-ink/70 leading-relaxed">
                Philadelphia has one of America's oldest pottery traditions. The Clay Studio is nationally respected and has been teaching ceramics for decades. The Pottery Gym in the city builds a community of "clay nerds" with a DIY spirit. Fishtown and Northern Liberties are creative neighborhoods packed with pottery studios. West Philly's Black Hound Clay Studio offers classes and membership. The city's art school legacy means many professional ceramicists teach here. Philly's pottery scene is inclusive, welcoming, and focused on community.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Philadelphia</h2>
              <p className="text-ink/70 leading-relaxed">
                The Clay Studio offers everything from beginner wheel throwing to advanced techniques. YAY Clay has open studio time plus kiln rental and glass slumping. Rebel Potters creates a safe space for diverse creatives to learn together. Classes range from drop-in sessions to multi-week courses. Many studios offer membership with 24-hour access for serious potters. Private lessons give personalized attention while group classes are social and fun. Studios often host special workshops with visiting artists.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Philadelphia</h2>
              <p className="text-ink/70 leading-relaxed">
                Fishtown has become pottery central with multiple studios near each other. Northern Liberties offers The Clay Studio and other creative spaces. West Philly's Cedar Park has Black Hound Clay Studio at 50th Street. Old City and South Philly have options too. Most studios are near SEPTA stops making them easy to reach. Philly's four seasons mean indoor pottery is perfect year-round. The city's DIY culture means studios are affordable and welcoming to beginners. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Fort Worth Specific Content */}
        {city.city === "Fort Worth" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Fort Worth</h2>
              <p className="text-ink/70 leading-relaxed">
                Fort Worth's Cultural District isn't just museums - it's home to thriving pottery studios too. Garret Pendergrass Pottery sits in the Near Southside just off Magnolia Avenue. Savor Ceramics brings modern ceramics to Montgomery Street. The city has over 35 years of pottery tradition with studios like Firehouse Pottery. CERA runs as a nonprofit making pottery accessible to everyone. Fort Worth's Western heritage mixes with modern art creating unique ceramic styles. The pottery community here is family-friendly and welcoming.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Fort Worth</h2>
              <p className="text-ink/70 leading-relaxed">
                Garret Pendergrass offers small group wheel classes and private hand-building lessons. Families love Sip & Clay nights where parents and kids create together. Membership ranges from $250-500 monthly with some offering 24/7 access. Open studio time is available Monday through Saturday at most places. Cloth & Glaze does walk-in pottery painting with no studio fees. Paradise Pottery adds glass fusing to the mix. Classes welcome all ages from kids to seniors.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Fort Worth</h2>
              <p className="text-ink/70 leading-relaxed">
                The Near Southside Cultural District has the most studios clustered around Magnolia. West 7th area is close to several pottery options. The Cultural District offers easy parking unlike busier Dallas. Fort Worth's smaller size means studios feel like neighborhood spots. The Texas heat makes air-conditioned studios a must in summer. Many studios are in converted warehouses with lots of space. The cowtown-meets-culture vibe makes pottery approachable and fun. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Las Vegas Specific Content */}
        {city.city === "Las Vegas" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Las Vegas</h2>
              <p className="text-ink/70 leading-relaxed">
                Las Vegas has pottery studios beyond the Strip where locals create art. The Arts District on Charleston Boulevard houses Mojave pottery painting studio. Summerlin offers family-friendly options like Color Me Mine. Oasis Pottery near UNLV welcomes all skill levels with no experience needed. Clay Arts Vegas on Arville Street is the city's hub for serious pottery education. The desert climate creates unique challenges and opportunities for working with clay. Vegas pottery scene is growing as more people seek creative outlets away from casinos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Las Vegas</h2>
              <p className="text-ink/70 leading-relaxed">
                Date night pottery is huge in Vegas - Clay Arts charges $250 per couple for four weeks. Regular classes run $185 for eight weeks at most studios. Mojave in the Arts District has pottery painting from $8-45 with no extra fees. CommonGround offers everything from kids classes to advanced sculpting. The Pottery Shop stays open late for Vegas night owls. Animal House in North Vegas even offers kiln firing for artists who work at home. Many studios offer one-on-one sessions for personalized learning.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Las Vegas</h2>
              <p className="text-ink/70 leading-relaxed">
                The Arts District downtown is best for serious pottery with multiple studios. Summerlin has family-friendly spots perfect for suburbanites. Near UNLV, Oasis Pottery serves students and locals. South Las Vegas Boulevard has The Pottery Shop for late-night creating. Most studios have plenty of parking - essential in spread-out Vegas. The dry desert air means clay needs extra moisture and careful handling. Air conditioning keeps studios comfortable even in 115-degree summers. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* St. Petersburg Content */}
        {city.city === "St. Petersburg" && city.state === "FL" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in St. Petersburg</h2>
              <p className="text-ink/70 leading-relaxed">
                St. Petersburg has the biggest pottery facility in the Southeast. The Morean Center for Clay fills a historic train depot in the Warehouse Arts District with over 50 ceramic studios. This sunshine city blends beach vibes with serious art making. The downtown arts scene exploded when artists moved into old warehouses. Now pottery studios mix with galleries and cafes throughout the city. The Hive offers memberships with 29 pottery wheels and daily firings. From downtown to the beaches, St. Pete makes clay accessible to everyone who wants to get muddy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in St. Petersburg</h2>
              <p className="text-ink/70 leading-relaxed">
                The Morean Center teaches everything from beginner wheel throwing to advanced sculpture techniques. Professional artists run workshops on raku firing and pit firing methods. The Hive gives members 24/7 studio access with all glazes and firings included. Sugar Cream Clay provides private lessons for personal attention. Atelier St. Pete offers planter-making workshops perfect for Florida gardeners. MCS Clay Studios in nearby Clearwater has membership options for serious artists. Classes range from $40 for single sessions to $200 monthly memberships. Many studios offer special workshops with visiting ceramic artists from around the country.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in St. Petersburg</h2>
              <p className="text-ink/70 leading-relaxed">
                The Warehouse Arts District at 22nd Street South is pottery central. This former industrial area now houses the biggest concentration of clay studios. Downtown has smaller studios perfect for beginners. Fourth Street offers artsy shops with pottery painting options. Beach areas have tourist-friendly drop-in classes. The tropical climate means studios stay open year-round. Florida humidity actually helps keep clay workable longer. Most studios have great parking since St. Pete is a driving city. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Oakland Content */}
        {city.city === "Oakland" && city.state === "CA" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Oakland</h2>
              <p className="text-ink/70 leading-relaxed">
                Oakland pottery studios mix industrial grit with creative energy. The Crucible teaches ceramics alongside metalworking in their massive makerspace. Temescal and Jack London Square neighborhoods house community clay studios. This East Bay city offers more affordable studio space than San Francisco. Artists have transformed old warehouses into creative centers. Waveform Ceramics on Aileen Street keeps classes small and vibes chill. Kollektiv Clay Studio focuses on sustainability and community building. Oakland's diverse culture shows up in the variety of pottery styles taught across the city.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Oakland</h2>
              <p className="text-ink/70 leading-relaxed">
                Merritt Ceramics fosters artistic expression through traditional techniques. Clay Clubhouse offers team building workshops perfect for tech companies. Clayroom's new Oakland location has a 1,500-square-foot outdoor space for raku firings. The Crucible combines ceramics with other industrial arts for unique projects. Studio One Art Center runs youth programs with master artists teaching. Kollektiv offers six-week courses alongside drop-in classes. Waveform specializes in beginner-friendly wheel throwing with flexible scheduling. Monthly memberships run $150-250 while single classes start at $45.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Oakland</h2>
              <p className="text-ink/70 leading-relaxed">
                Temescal has the highest concentration of pottery studios in walkable neighborhoods. West Oakland warehouse spaces offer the most affordable memberships. Downtown near Jack London Square combines pottery with dining and entertainment. BART access makes many studios reachable without driving. The mild Bay Area weather means comfortable studio conditions all year. Oakland's maker culture welcomes beginners alongside professional artists. Many studios host monthly sales where students can sell their work. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Atlanta Content */}
        {city.city === "Atlanta" && city.state === "GA" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Atlanta</h2>
              <p className="text-ink/70 leading-relaxed">
                Atlanta clay studios build community through mud and fire. MudFire in Decatur has brought potters together since 2001 with their popular membership program. The nonprofit Atlanta Clay Works sits in Kirkwood mixing studio space with public galleries. Grit Ceramics fills a plant-filled Sylvan Hills space with creative energy. The West End welcomes new studios like Molly Sanyour Ceramics in the Spot development. From Castleberry Hill to Little Five Points, Atlanta neighborhoods each add their own flavor to clay work. The city's pottery scene grows stronger as artists find affordable spaces in emerging neighborhoods.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Atlanta</h2>
              <p className="text-ink/70 leading-relaxed">
                Chastain Arts Center has taught pottery since 1968 as Atlanta's oldest arts facility. Spruill in Dunwoody goes through 45 tons of clay yearly across four dedicated studios. All Fired Up offers pottery painting at three locations with 700 items to choose from. MudFire's membership includes 57 weekly hours of studio access with all tools and glazes. Grit hosts private parties alongside regular classes and workshops. Atlanta Clay Works runs both community classes and professional development programs. Eight-week courses typically cost $200-300 while drop-in workshops run $40-60. Many studios offer date night specials for couples.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Atlanta</h2>
              <p className="text-ink/70 leading-relaxed">
                Decatur and Kirkwood offer walkable neighborhoods with established studios. The West End and Sylvan Hills have newer spaces with fresh energy. Dunwoody serves north Atlanta suburbs with family-friendly options. Castleberry Hill arts district connects pottery to the broader creative scene. Atlanta traffic means choosing a studio near home or work saves time. The humid Georgia climate keeps clay workable but requires good studio ventilation. Many studios have ample parking since Atlanta is a driving city. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Louisville Content */}
        {city.city === "Louisville" && city.state === "KY" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Louisville</h2>
              <p className="text-ink/70 leading-relaxed">
                Louisville mixes southern charm with modern clay culture. AA Clay Studio leads the way with wheel throwing on Thursday nights and Sunday morning hand-building. Payne Street Pottery sits in the artsy Crescent Hill neighborhood combining a working studio with gallery space. From NuLu to the Highlands, pottery studios dot the creative neighborhoods. Bardstown Road arts scene includes multiple clay options. The Metro Arts Community Center makes pottery affordable for everyone. Kentucky Mudworks serves both Louisville and Lexington with tools and training. This bourbon city knows how to blend tradition with fresh artistic energy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Louisville</h2>
              <p className="text-ink/70 leading-relaxed">
                AA Clay Studio runs Thursday evening wheel classes from 6 to 8:30 and Sunday hand-building from 10 to noon. The Artist In You offers date night pottery for $30 per person perfect for couples. Payne Street provides instructor-led classes plus monthly studio rentals for experienced potters. Paint Spot and Ms Audrey's Crafting Emporium offer paint-your-own pottery for families. Metro Arts Community Center teaches both pottery and silversmithing at budget prices. Kentucky Mudworks hosts demos and internships alongside regular classes. Most studios charge $150-200 for multi-week courses with open studio memberships running $100-150 monthly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Louisville</h2>
              <p className="text-ink/70 leading-relaxed">
                The Highlands and Cherokee Triangle have the most walkable studio options. NuLu arts district combines pottery with galleries and restaurants. Old Louisville offers historic charm with affordable studio space. Bardstown Road provides easy parking and lots of creative energy. Crescent Hill and Clifton Heights house established studios like Payne Street. South-central Louisville has AA Clay Studio with plenty of open hours. The city's manageable size means you can reach any studio in 20 minutes. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Sacramento Content */}
        {city.city === "Sacramento" && city.state === "CA" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Sacramento</h2>
              <p className="text-ink/70 leading-relaxed">
                Sacramento pottery studios blend capital city culture with California creativity. ACAI Studios runs a 3,000-square-foot nonprofit space in Fair Oaks teaching everyone from age 5 up. Sincere Ceramics has served the community since 2015 with classes and gallery shows. SEED focuses on BIPOC ceramic traditions bringing diverse voices to clay. The East Sacramento workshop clayARTstudio 814 specializes in unique hand-building techniques. Midtown and R Street arts districts add urban energy to the pottery scene. Davis Arts Center extends options to the greater Sacramento region. This farm-to-fork city brings the same passion for local craft to its pottery studios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Sacramento</h2>
              <p className="text-ink/70 leading-relaxed">
                ACAI Studios offers four-week sessions with two-hour classes for all skill levels. Sincere Ceramics provides both classes and gallery space for local artists. SEED offers varying membership levels with open studio access for established ceramicists. clayARTstudio 814 runs specialized hand-building workshops you cannot find elsewhere. Verge Center brings contemporary approaches to traditional clay work. Davis Arts Center teaches wheel throwing in small groups for personal attention. Alpha Fired Arts and The Creative Space round out options with drop-in classes. Sessions typically cost $150-250 for multi-week courses with materials included.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Sacramento</h2>
              <p className="text-ink/70 leading-relaxed">
                Fair Oaks has the largest facility at ACAI Studios with everything needed for ceramic art. East Sacramento offers neighborhood studios like clayARTstudio 814. Midtown brings urban vibes though specific pottery studios are harder to find. The Southside Park area houses Verge Center for contemporary approaches. Davis provides additional options just outside the city. Sacramento's grid system makes navigation easy to any studio location. The dry Central Valley climate requires careful clay moisture management. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* McKinney Content */}
        {city.city === "McKinney" && city.state === "TX" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in McKinney</h2>
              <p className="text-ink/70 leading-relaxed">
                Historic downtown McKinney packs pottery studios into charming old buildings. McKinney Art House sits two blocks from the square teaching wheel and hand-building since 2005. Walls of Clay has served families for 23 years with paint-your-own pottery fun. Jump Into Art Studios fills a historic home with creative spaces inside and out. Glaze Ceramic Studio transformed the old Cotton Mill into a thriving ceramics center. Folklorez brings people together in the heart of downtown. This North Texas town proves small cities can support big pottery communities. The historic district creates perfect walking between studios, galleries, and cafes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in McKinney</h2>
              <p className="text-ink/70 leading-relaxed">
                McKinney Art House teaches both wheel throwing and hand-building with two electric kilns plus raku firing. Jump Into Art offers Sip and Throw experiences combining pottery with beverages. Glaze Ceramic Studio runs artist residencies alongside regular classes for all levels. Walls of Clay makes pottery accessible with no experience needed paint sessions. Folklorez provides one-time experiences perfect for date nights or friend groups. Many studios offer kids classes, adult workshops, and homeschool programs. Private lessons and party packages bring groups together over clay. Classes range from $25 drop-in sessions to $200 for multi-week courses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in McKinney</h2>
              <p className="text-ink/70 leading-relaxed">
                The historic downtown square area has the highest concentration of studios within walking distance. Kentucky Street near the library houses McKinney Art House. The Cotton Mill location gives Glaze Ceramic Studio industrial charm. Free parking throughout downtown makes studio hopping easy. The charming front porches and outdoor spaces at studios like Jump Into Art add Texas hospitality. McKinney combines small-town friendliness with serious ceramic education. Studios welcome beginners while supporting professional development. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Dallas Content */}
        {city.city === "Dallas" && city.state === "TX" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Dallas</h2>
              <p className="text-ink/70 leading-relaxed">
                Dallas brings big city energy to Texas pottery. The Creative Arts Center in East Dallas runs the largest community ceramics program with two huge work areas. Pottery for the People hosts Clay Nights perfect for date nights or friend groups. Trade Oak Cliff adds creative flair to the southern neighborhoods. FCS Clayworks and the Craft Guild of Dallas serve serious ceramicists. From Deep Ellum to Bishop Arts District, creative neighborhoods support clay artists. The city offers everything from drop-in painting to professional development. Dallas proves Texas creativity extends beyond oil and cattle to clay and kilns.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Dallas</h2>
              <p className="text-ink/70 leading-relaxed">
                Creative Arts Center offers over 500 adult classes yearly including wheel throwing and hand-building. Pottery for the People runs two-hour Clay Nights alongside four-week intensive courses. Trade Oak Cliff provides beginner-friendly weekly sessions perfect for newbies. Quiggly's Clayhouse and Holman Pottery offer specialized techniques. Trinity Ceramic Supply combines materials with education. Oil and Cotton mixes pottery with other crafts in their workshops. Classes range from $35 drop-ins to $250 for multi-week courses. Many studios offer BYOB options for adult classes making pottery social and fun.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Dallas</h2>
              <p className="text-ink/70 leading-relaxed">
                East Dallas has the Creative Arts Center with dedicated ceramics facilities. Oak Cliff and Bishop Arts District offer walkable creative neighborhoods with multiple studios. Deep Ellum arts scene includes pottery alongside music venues. Knox Henderson provides upscale options in a trendy setting. Plano suburbs have family-friendly studios like Pipe and Palette. Dallas traffic means choosing a studio near home or work saves frustration. The hot Texas summers make air-conditioned studios essential. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Richmond Content */}
        {city.city === "Richmond" && city.state === "VA" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Richmond</h2>
              <p className="text-ink/70 leading-relaxed">
                Richmond pottery studios blend history with hip neighborhoods. Rosewood Pottery anchors the Fan District as the only full-service community clay studio. Still Life Studio just opened in Scott's Addition with rare 24/7 member access. All Fired Up has served Carytown since 1996 with paint-your-own ceramics. The Visual Arts Center runs two full studios with gas and raku kilns. VMFA Studio School adds museum-quality education to the mix. Hand/Thrown hosts Community Clay Days for Northside neighbors. This capital city supports both casual creators and serious ceramicists across its creative districts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Richmond</h2>
              <p className="text-ink/70 leading-relaxed">
                Still Life Studio offers everything from beginner classes to artist workshops with that coveted 24/7 access. Rosewood focuses exclusively on clay with comprehensive pottery programs. VisArts features 12 wheels per studio plus outdoor firing areas for special techniques. VMFA teaches ceramic sculpture alongside traditional pottery skills. All Fired Up makes ceramics accessible with hundreds of pieces ready to paint. Hand/Thrown brings in guest artists for two-day intensive workshops. Classes typically run $150-300 for multi-week sessions. Memberships with studio access range from $100-200 monthly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Richmond</h2>
              <p className="text-ink/70 leading-relaxed">
                The Fan District on Cary Street offers walkable access to Rosewood Pottery. Scott's Addition combines breweries with Still Life Studio for perfect evening combos. Carytown provides shopping and ceramics at All Fired Up. The museum district houses VMFA's professional programs. Northside neighborhoods benefit from Hand/Thrown's community focus. Richmond's compact size makes any studio reachable within 20 minutes. The four-season climate means comfortable studio conditions most of the year. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Cedar Park Content */}
        {city.city === "Cedar Park" && city.state === "TX" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Cedar Park</h2>
              <p className="text-ink/70 leading-relaxed">
                Cedar Park pottery studios serve Austin's northern suburbs with family-friendly options. Cedar Park Pottery on Russet Valley offers wheels, kilns, and comprehensive classes. The Studio Cedar Park brings together artists teaching everything from pottery to music. Cordovan Art School's Pottery Parlor makes paint-your-own ceramics fun for all ages. Ceramics N More on Whitestone Boulevard combines pottery wheels with glass fusing. Nearby Leander adds The Spinning Wheel ATX with over 80 craft options. Round Rock Community Clay and Ceramic Lodge expand choices. This fast-growing area proves suburbs can support serious pottery education.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Cedar Park</h2>
              <p className="text-ink/70 leading-relaxed">
                Cedar Park Pottery provides full pottery education with multiple wheels and kilns. Art + Academy teaches ceramics alongside drawing and sculpture for well-rounded artists. Pottery Parlor offers open clay days and to-go kits perfect for busy families. Ceramics N More runs paint sessions plus wheel throwing classes. The Studio Cedar Park operates as an artist co-op with varied teaching styles. Nearby Austin adds Cafe Monet for wheel fundamentals and Feats of Clay as the oldest studio around. Classes range from $15 paint sessions to $200 multi-week courses. Birthday parties and group events make pottery social.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Cedar Park</h2>
              <p className="text-ink/70 leading-relaxed">
                Whitestone Boulevard has the highest concentration of studios with easy parking. The Russet Valley area offers Cedar Park Pottery's dedicated facility. Leander provides additional options just minutes away. Round Rock adds more choices for north Austin suburbs. The area's rapid growth means new studios open regularly. Family-friendly scheduling accommodates school and work schedules. Texas heat makes summer camps popular for kids needing indoor activities. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Hialeah Content */}
        {city.city === "Hialeah" && city.state === "FL" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Hialeah</h2>
              <p className="text-ink/70 leading-relaxed">
                Hialeah brings pottery to Miami-Dade's second-largest city. Local studios offer daily classes from 11 AM to 9 PM serving the Cuban-American community. Hand-building and painting classes start at $90 for two-hour sessions. Kids as young as 3 can join family pottery time. The Ceramic League of Miami provides serious training nearby. MIY Ceramics in Hollywood adds glass fusing to clay work. Anhinga Clay Studios in Homestead runs day camps for school holidays. This diverse area makes pottery accessible to Spanish and English speakers alike with bilingual instruction common.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Hialeah</h2>
              <p className="text-ink/70 leading-relaxed">
                Hialeah studios specialize in hand-building perfect for beginners and families. Paint-your-own pottery appeals to kids and casual creators. The Ceramic League teaches wheel throwing, raku, and mosaics for advanced students. Mercy Pottery focuses on therapeutic clay sessions helping people relax. MIY Ceramics combines pottery with glass art for unique mixed media. Color Me Mine in South Miami offers simple painting projects. Classes accommodate all ages from toddlers to seniors. Prices range from $25 for paint sessions to $200 for multi-week courses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Hialeah</h2>
              <p className="text-ink/70 leading-relaxed">
                Central Hialeah has studios open seven days a week with flexible hours. The Miami-Dade area offers dozens more options within 20 minutes. Hollywood and Fort Lauderdale expand choices northward. Homestead provides options to the south. Most studios offer bilingual instruction serving the diverse community. The tropical climate means year-round comfortable studio conditions. Parking is typically plentiful at strip mall locations. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Boston Content */}
        {city.city === "Boston" && city.state === "MA" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Boston</h2>
              <p className="text-ink/70 leading-relaxed">
                Boston pottery studios are bursting at the seams with waitlists everywhere. Clay Lounge runs community spaces in Boston and Somerville welcoming all skill levels. Mudflat Studio operates as a nonprofit in Somerville teaching ceramic arts since forever. Feet of Clay in Brookline runs a cooperative where artists share space and knowledge. Commonwealth Clayworks brings urban pottery to Cambridge's doorstep. The Clayroom offers paint-your-own fun for groups up to 40 people. Indigo Fire teaches outside the city with semester-long programs. This hot hobby has Bostonians fighting for wheel time across the metro area.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Boston</h2>
              <p className="text-ink/70 leading-relaxed">
                Mudflat offers everything from beginner workshops to artist residencies in their nonprofit space. Clay Lounge welcomes drop-ins alongside structured classes for community building. Feet of Clay hosts free Third Thursday hand-building perfect for trying clay. Commonwealth Clayworks focuses on urban ceramics with contemporary techniques. The Clayroom provides 56 paint colors for decorating pre-made pieces. Indigo Fire runs one-time wheel experiences where you return later for finished pots. Semester classes fill immediately so planning ahead is essential. Classes cost $200-400 for multi-week sessions with materials included.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Boston</h2>
              <p className="text-ink/70 leading-relaxed">
                Somerville has the highest concentration of studios near the Red Line. Brookline offers Feet of Clay's cooperative model perfect for committed potters. Cambridge provides easy T access to multiple studios. The city proper has fewer options but Clay Lounge fills that gap. Suburban studios like Indigo Fire offer parking but require driving. Boston's pottery boom means registering early for any class. The four-season climate makes winter pottery a cozy indoor activity. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Bellevue Content */}
        {city.city === "Bellevue" && city.state === "WA" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Bellevue</h2>
              <p className="text-ink/70 leading-relaxed">
                Bellevue leads the Eastside with 24-hour pottery access for busy tech workers. Kokanee Clay Studio sits in the BelRed Arts District between downtown and Redmond. Eastside Pottery runs Washington's first network of round-the-clock studios. Creatively Yours at Crossroads offers paint-your-own ceramics for families. Kirkland Arts Center provides 20-plus hours of weekly open studio time. Paint Away in Redmond Town Center adds glass fusing to pottery painting. The Eastside pottery scene accommodates Microsoft and Amazon schedules with flexible access. This suburban tech hub proves pottery thrives alongside pixels and code.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Bellevue</h2>
              <p className="text-ink/70 leading-relaxed">
                Kokanee Clay offers classes, workshops, and events for all levels with that crucial 24/7 access. Eastside Pottery requires prior experience but provides specialty workshops on raku and alternative firing. Kirkland Arts Center includes clay, glazes, and firing with most classes. Creatively Yours makes ceramics approachable with paint-it-yourself projects. Paint Away combines pottery painting with glass fusing for unique creations. Studios offer everything from date nights to professional development. Memberships with 24-hour access run $150-250 monthly. Drop-in painting sessions start at $10 plus piece cost.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Bellevue</h2>
              <p className="text-ink/70 leading-relaxed">
                The BelRed Arts District houses multiple studios in converted warehouses. Downtown Bellevue offers easy access from tech campuses. Redmond Town Center provides family-friendly options with ample parking. Kirkland waterfront adds scenic pottery making. The 24-hour access accommodates any schedule from early birds to night owls. Eastside traffic means choosing studios near work saves commute stress. The mild Pacific Northwest climate keeps studios comfortable year-round. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Long Island City Content */}
        {city.city === "Long Island City" && city.state === "NY" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Long Island City</h2>
              <p className="text-ink/70 leading-relaxed">
                Long Island City pottery studios thrive among converted warehouses and artist lofts. BrickHouse Ceramic Art Center fills 4,000 square feet between auto shops and truck lots. AlterWork Studios in nearby Astoria offers multidisciplinary arts including ceramics and printmaking. These Queens neighborhoods provide more space than Manhattan at better prices. The industrial vibe attracts serious artists seeking dedicated studio time. BrickHouse teaches by semester or two-hour private sessions for beginners. AlterWork runs pottery alongside sewing, screenprinting, and sculpture classes. This outer borough scene proves NYC creativity extends beyond Manhattan into Queens.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Long Island City</h2>
              <p className="text-ink/70 leading-relaxed">
                BrickHouse offers wheel throwing and hand-building for all levels with dedicated glazing and kiln rooms. Their clever two-hour tasters help beginners discover their preferred technique. AlterWork provides year-round pottery classes with membership tiers for studio access. Classes cover wheel work, hand-building, casting, and sculpture techniques. ClassBento connects students with various instructors across Queens. Studios accommodate solo artists and group activities alike. Semester classes provide deep learning while drop-ins offer flexibility. Prices range from $50 for single sessions to $400 for semester programs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Long Island City</h2>
              <p className="text-ink/70 leading-relaxed">
                The warehouse district provides ample studio space with industrial charm. Astoria offers AlterWork's community center vibe near the subway. BrickHouse closes Sundays and Saturday afternoons so plan accordingly. The 7 train connects LIC to Manhattan in minutes. Street parking is easier than Manhattan but fills during weekdays. The gritty surroundings inspire urban creativity. Many studios share buildings with other artists creating collaborative energy. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* San Jose Content */}
        {city.city === "San Jose" && city.state === "CA" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in San Jose</h2>
              <p className="text-ink/70 leading-relaxed">
                San Jose pottery studios serve Silicon Valley with creative breaks from tech work. Higher Fire runs two locations downtown and in Japantown offering team building for Bay Area companies. Petroglyph Ceramic Lounge brings paint-your-own fun to Willow Glen since 1993. Color Me Mine at Oakridge Mall makes ceramics accessible for families. Good Life Ceramics delivers finished projects to corporate offices. South Bay Ceramics in nearby Mountain View adds more wheel options. Sunnyvale Creative Arts Center provides open studio time. This tech capital proves engineers and artists both need time with clay.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in San Jose</h2>
              <p className="text-ink/70 leading-relaxed">
                Higher Fire's six-week beginner wheel classes cost $399 including everything you need. They specialize in corporate team off-sites perfect for tech companies. Petroglyph offers walk-in pottery painting for spontaneous creativity. Color Me Mine provides parties and group events alongside drop-in painting. Good Life Ceramics runs two-hour sessions starting at $75 per person. South Bay Ceramics teaches intro wheel throwing with membership options. Classes range from casual paint sessions to intensive multi-week programs. Many studios cater to Silicon Valley schedules with evening and weekend options.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in San Jose</h2>
              <p className="text-ink/70 leading-relaxed">
                Downtown has Higher Fire at South Market Street for urban convenience. Japantown offers their second location on North 7th Street. Willow Glen provides neighborhood charm at Petroglyph. Oakridge Mall makes Color Me Mine easy to reach with ample parking. Mountain View and Sunnyvale expand options for South Bay residents. San Jose's sprawl means choosing a studio near home or work saves driving time. The Mediterranean climate keeps studios comfortable year-round. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Tampa Content */}
        {city.city === "Tampa" && city.state === "FL" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Tampa</h2>
              <p className="text-ink/70 leading-relaxed">
                Tampa pottery studios blend Florida creativity with urban energy. DRIP in Ybor City combines 20 pottery wheels with live music and gallery nights. The Ceramic Garden teaches everything from wheel throwing to glass fusion. Color Me Mine Tampa makes paint-your-own pottery accessible citywide. City Parks and Recreation offers affordable classes in multiple media. The Potter's House Studio adds professional training options. Nearby St. Pete has the massive Morean Center in a historic train depot. From Ybor's artistic vibe to suburban family studios, Tampa clay scene keeps growing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Tampa</h2>
              <p className="text-ink/70 leading-relaxed">
                DRIP offers wheel throwing, ceramic painting, mosaics, and hand-building for all levels. Their after-school programs serve kids while evening classes attract adults. The Ceramic Garden runs workshops and art camps alongside regular classes. City programs include ceramic sculpture, pottery, and mixed media at budget prices. Charlie Parker Pottery and Divine Ceramics offer specialized techniques. MCS Clay Studios in Clearwater expands options across the bay. Classes range from $20 drop-ins to $250 for multi-week courses. Many studios combine pottery with other arts for creative variety.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Tampa</h2>
              <p className="text-ink/70 leading-relaxed">
                Ybor City offers DRIP's creative energy in the historic district. Hyde Park and Westshore have family-friendly options though specific studios vary. Downtown provides city-run programs at recreation centers. St. Petersburg adds world-class facilities just across the bay. Tampa's spread-out layout means driving to most studios. The humid subtropical climate keeps studios air-conditioned year-round. Parking is typically plentiful at strip mall locations. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Irvine Content */}
        {city.city === "Irvine" && city.state === "CA" && (
          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">About Pottery in Irvine</h2>
              <p className="text-ink/70 leading-relaxed">
                Irvine pottery studios serve Orange County with pristine facilities and professional instruction. The city-run Fine Arts Center features three gas kilns, electric kilns, raku capability, and dozens of wheels. Olomana Studios offers group classes focusing on relaxation through clay work. Hello Pottery adds DIY fun with pottery, slime, and resin projects. Nearby Costa Mesa has Artime Barro and The Pottery Studio for more options. Mud Hen Clay combines reserved classes with walk-in painting. This master-planned city provides organized pottery education matching its orderly streets. Orange County's pottery scene offers something for every skill level.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Types of Pottery Classes Available in Irvine</h2>
              <p className="text-ink/70 leading-relaxed">
                Irvine Fine Arts Center provides comprehensive ceramics with professional equipment and cone 10 firing. Olomana teaches traditional techniques like making matcha bowls and ikebana vases. Kids classes focus on hand-building and creative expression. Artime Barro offers one-hour sessions making two pieces with free glazing returns. The Pottery Studio includes unlimited open studio with ongoing classes. Mud Hen runs Saturday wheel workshops with patient instruction. Hello Pottery makes crafts accessible to all ages. Classes range from $40 single sessions to $300 for multi-week programs with materials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink mb-4">Getting Started in Irvine</h2>
              <p className="text-ink/70 leading-relaxed">
                The Fine Arts Center anchors Irvine's pottery scene with city-supported programs. Great Park and Spectrum areas have easy access to multiple studios. Costa Mesa adds several options just minutes away. Orange County's excellent roads make any studio reachable quickly. The perfect Southern California weather means comfortable conditions year-round. Ample parking at every location removes that stress. The family-friendly atmosphere welcomes beginners of all ages. Start by searching our directory for pottery classes near you to find the perfect studio.
              </p>
            </section>
          </div>
        )}

        {/* Related Cities */}
        <section className="mt-16 pt-12 border-t border-sand/20">
          <h2 className="text-2xl font-semibold text-ink mb-6">
            Explore Nearby Cities
          </h2>
          <p className="text-ink/60 mb-6">
            Looking for pottery classes in other cities? Browse our directory to find 
            ceramic studios and workshops across {fullStateName}.
          </p>
          <Link href={`/pottery-classes/${city.state_slug}`} className="text-teal hover:text-clay font-medium">
            View all cities in {fullStateName} →
          </Link>
        </section>
      </div>
    </main>
  );
}