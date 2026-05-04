import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const About = () => {
    const sections = [
        {
            title: '1. Regular Exercise',
            content: 'Sufficient exercise is a key part in keeping your dog healthy, happy, and away from destructive habits such as chewing. In general, dogs need at least 30 minutes of aerobic exercise each day.',
            image: '/image/dog_exercise_premium.png'
        },
        {
            title: '2. Proper Nutrition',
            content: 'The six basic nutrients are water, proteins, fats, carbohydrates, minerals, and vitamins. The best food is a high quality commercial kibble designed for their age and size. Provide a balanced diet.',
            image: '/image/dog_nutrition_premium.png'
        },
        {
            title: '3. Training & Socialization',
            content: 'Teach your dog basic commands like sit, stay, and come. Expose your dog to various social situations. When a dog is well-socialized, they will be more at ease with new people and situations.',
            image: '/image/dog_training_premium.png'
        },
        {
            title: '4. Health and Vet Check-ups',
            content: 'Take your dog to the vet for routine check-ups and vaccinations. Adult dogs and cats require at least one veterinary check-up every 4 to 6 months. Do not wait until your pet is sick.',
            image: '/image/dog_health_premium.png'
        }
    ];

    return (
        <div className="py-16 md:py-20 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">Dog Care Guide</h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                        Follow these essential steps to ensure your dog's well-being.
                    </p>
                </motion.div>

                <div className="space-y-16 md:space-y-20">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className={`flex flex-col md:flex-row gap-8 md:gap-12 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                            <div className="w-full md:w-1/2">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-slate-200">
                                    <img src={section.image} alt={section.title} loading="lazy" className="object-cover w-full h-full" />
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 space-y-4 md:space-y-6">
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">{section.title}</h2>
                                <p className="text-base md:text-lg text-slate-600 leading-relaxed">{section.content}</p>
                                <Link
                                    to={
                                        section.title.includes('Exercise') ? '/exercise' :
                                            section.title.includes('Nutrition') ? '/nutrition' :
                                                section.title.includes('Training') ? '/training' :
                                                    section.title.includes('Health') ? '/health' : '#'
                                    }
                                    className="group relative inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 text-green-700 rounded-full font-bold text-sm overflow-hidden transition-all hover:bg-green-500 hover:text-white shadow-sm hover:shadow-lg hover:shadow-green-500/20"
                                >
                                    <span className="relative z-10">View Detailed Guide</span>
                                    <motion.div
                                        className="relative z-10"
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <ArrowRight size={18} />
                                    </motion.div>
                                    <div className="absolute inset-0 bg-green-500 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
