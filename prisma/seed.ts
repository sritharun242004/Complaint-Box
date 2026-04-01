import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Real Unsplash photos matched to Chennai civic issues
const complaints = [
  {
    name: 'Ramesh Kumar',
    mobile: '9876543210',
    area: 'mylapore',
    title: 'Severe potholes near Kapaleeshwarar Temple',
    description: 'The road leading to Kapaleeshwarar Temple from Mylapore tank has multiple deep potholes that have been growing for months. During rains, water fills them up making it impossible to distinguish depth. Several two-wheeler riders have fallen and injured themselves. Urgent repair needed before monsoon.',
    imageUrl: 'https://source.unsplash.com/VubGkfQjNFk/800x600',
    category: 'roads',
    location: 'Near Kapaleeshwarar Temple, Mylapore',
    latitude: 13.0339,
    longitude: 80.2697,
    upvotes: 47,
    status: 'reviewed' as const,
    adminReply: 'Thank you for raising this. We have forwarded this to the Corporation Roads Department. A team will inspect the area within 48 hours.',
    repliedAt: new Date('2026-03-28'),
  },
  {
    name: 'Priya Lakshmi',
    mobile: '9845612378',
    area: 'mandaveli',
    title: 'No streetlights on 3rd Cross Street since 2 weeks',
    description: 'The streetlights on 3rd Cross Street, Mandaveli have been non-functional for over 2 weeks. The entire stretch from the bus stop to the railway station is completely dark after 7 PM. Women and senior citizens feel very unsafe walking here after dark.',
    imageUrl: 'https://source.unsplash.com/joRqWE9V4Qg/800x600',
    category: 'electricity',
    location: '3rd Cross Street, Mandaveli',
    latitude: 13.0225,
    longitude: 80.2621,
    upvotes: 34,
    status: 'pending' as const,
  },
  {
    name: 'Mohammed Farook',
    mobile: '9823456789',
    area: 'royapettah',
    title: 'Garbage not cleared for 5 days near Royapettah market',
    description: 'The garbage collection point near Royapettah market has not been cleared for 5 days. The pile is growing and the stench has become unbearable. Stray dogs are tearing open bags and spreading waste across the road. This is a major health hazard.',
    imageUrl: 'https://source.unsplash.com/kxTwgF_uHow/800x600',
    category: 'sanitation',
    location: 'Royapettah Market Road',
    latitude: 13.0560,
    longitude: 80.2631,
    upvotes: 62,
    status: 'pending' as const,
  },
  {
    name: 'Sujatha Venkatesh',
    mobile: '9812345670',
    area: 'alwarpet',
    title: 'Water supply only once in 3 days in Alwarpet',
    description: 'CMWSSB is providing water supply only once in 3 days instead of the usual daily supply. Many families in 5th Street are forced to buy water from private tankers costing Rs 500–800 per load. We demand regular supply immediately.',
    imageUrl: 'https://source.unsplash.com/YzZuCdBQ4Jg/800x600',
    category: 'water',
    location: '5th Street, Alwarpet',
    latitude: 13.0337,
    longitude: 80.2535,
    upvotes: 28,
    status: 'pending' as const,
  },
  {
    name: 'Karthik Rajan',
    mobile: '9867543210',
    area: 'rajaAnnamalaiPuram',
    title: 'Open manhole on Marina Beach Road footpath',
    description: 'There is an open manhole without any cover or barricade on the footpath along Marina Beach Road near RA Puram junction. Extremely dangerous especially at night. A child nearly fell in last week. Immediate action required.',
    imageUrl: 'https://source.unsplash.com/bXWEmibzfjY/800x600',
    category: 'safety',
    location: 'Marina Beach Road, RA Puram Junction',
    latitude: 13.0296,
    longitude: 80.2768,
    upvotes: 89,
    status: 'reviewed' as const,
    adminReply: 'Treated as emergency. Chennai Corporation has been alerted and a barricade has been placed. Permanent repair scheduled this week.',
    repliedAt: new Date('2026-03-30'),
  },
  {
    name: 'Lakshmi Narayanan',
    mobile: '9834567812',
    area: 'mylapore',
    title: 'Tree fallen on TANGEDCO power lines after storm',
    description: 'A large neem tree fell on power lines during last night\'s storm on Kutchery Road, Mylapore. Live wires are dangling close to the ground. The entire street has been without power since last night. This is an emergency safety hazard.',
    imageUrl: 'https://source.unsplash.com/E3U8X3lO3vk/800x600',
    category: 'electricity',
    location: 'Kutchery Road, Mylapore',
    latitude: 13.0345,
    longitude: 80.2680,
    upvotes: 71,
    status: 'resolved' as const,
    adminReply: 'TANGEDCO crew was dispatched and the tree has been removed. Power has been restored. Thank you for your patience.',
    repliedAt: new Date('2026-03-29'),
  },
  {
    name: 'Anitha Raj',
    mobile: '9856781234',
    area: 'mandaveli',
    title: 'Sewage overflowing near Mandaveli railway station',
    description: 'Raw sewage has been overflowing on the main road near Mandaveli railway station for 3 days. The foul smell and contaminated water are causing health issues for nearby shop owners and daily commuters. Urgent attention needed.',
    imageUrl: 'https://source.unsplash.com/YIqANSWjCo4/800x600',
    category: 'sanitation',
    location: 'Near Mandaveli Railway Station',
    latitude: 13.0230,
    longitude: 80.2600,
    upvotes: 55,
    status: 'pending' as const,
  },
  {
    name: 'Vijay Shankar',
    mobile: '9878901234',
    area: 'royapettah',
    title: 'No speed bumps near DAV School zone',
    description: 'The stretch near DAV School on Royapettah High Road has no speed bumps or school zone markings. Vehicles speed recklessly during school timings. Multiple near-miss accidents have occurred. Children\'s safety is at serious risk.',
    imageUrl: 'https://source.unsplash.com/m7deW5vC4AU/800x600',
    category: 'safety',
    location: 'DAV School, Royapettah High Road',
    latitude: 13.0555,
    longitude: 80.2615,
    upvotes: 43,
    status: 'pending' as const,
  },
  {
    name: 'Meena Sundaram',
    mobile: '9890123456',
    area: 'alwarpet',
    title: 'Footpath on TTK Road blocked by street vendors',
    description: 'The footpath on TTK Road near Alwarpet signal is completely occupied by street vendors. Pedestrians are forced to walk on the main road which has heavy traffic. This is both a safety issue and a civic violation.',
    imageUrl: 'https://source.unsplash.com/tfoRoSoSH_k/800x600',
    category: 'roads',
    location: 'TTK Road, Alwarpet Signal',
    latitude: 13.0340,
    longitude: 80.2530,
    upvotes: 31,
    status: 'pending' as const,
  },
  {
    name: 'Deepak Krishnan',
    mobile: '9801234567',
    area: 'rajaAnnamalaiPuram',
    title: 'Stagnant water and flooding in RA Puram after rain',
    description: 'RA Puram residential streets flood within 30 minutes of any rain. Stagnant water stays for 2–3 days, breeding mosquitoes. Residents are reporting increased dengue cases. Storm water drain is blocked and needs urgent clearing.',
    imageUrl: 'https://source.unsplash.com/sGJIlg4z8AA/800x600',
    category: 'water',
    location: 'RA Puram 2nd Main Road',
    latitude: 13.0290,
    longitude: 80.2600,
    upvotes: 19,
    status: 'pending' as const,
  },
]

async function main() {
  console.log('Seeding Chennai complaints...\n')

  await prisma.vote.deleteMany()
  await prisma.complaint.deleteMany()

  for (const complaint of complaints) {
    const created = await prisma.complaint.create({ data: complaint })
    console.log(`  ✓ "${created.title}" — ${created.area}${created.adminReply ? ' [admin replied]' : ''}`)
  }

  console.log(`\n✅ Seeded ${complaints.length} Chennai complaints successfully!`)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
