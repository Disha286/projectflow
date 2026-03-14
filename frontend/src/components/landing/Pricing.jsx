import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for small teams getting started',
    features: ['Up to 5 members', '3 projects', 'Basic task management', 'Email notifications', '1GB storage'],
    cta: 'Get started free',
    variant: 'secondary',
    popular: false
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per user/month',
    description: 'For growing teams that need more power',
    features: ['Unlimited members', 'Unlimited projects', 'Sprint planning', 'Advanced analytics', 'Priority support', '50GB storage'],
    cta: 'Start free trial',
    variant: 'primary',
    popular: true
  },
  {
    name: 'Team',
    price: '$29',
    period: 'per user/month',
    description: 'For large teams with advanced needs',
    features: ['Everything in Pro', 'Custom roles', 'SSO / SAML', 'Audit logs', 'Dedicated support', 'Unlimited storage'],
    cta: 'Contact sales',
    variant: 'secondary',
    popular: false
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-4"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            No hidden fees. Cancel anytime.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-gray-900 rounded-2xl p-8 border ${plan.popular ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-gray-800'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm">/{plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                    <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/register" className="block">
                <Button variant={plan.variant} size="lg" className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;