const Team = () => {
  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      description: "Visionary leader with 15+ years in fashion retail",
    },
    {
      name: "Michael Chen",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      description: "Award-winning designer with a passion for innovation",
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Experience",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      description: "Dedicated to creating exceptional shopping experiences",
    },
  ];

  return (
    <div className="mb-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Meet Our Team
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          The talented people behind our success
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {team.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl overflow-hidden shadow-lg border border-sand/20 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="relative h-80 overflow-hidden bg-linear-to-br from-cream to-linen">
              <img
                src={`${member.image}?auto=format&fit=crop&w=400&h=500`}
                alt={member.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-bold text-gray-900">
                {member.name}
              </h3>
              <p className="text-sm font-semibold text-sand uppercase tracking-wider">
                {member.role}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {member.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
