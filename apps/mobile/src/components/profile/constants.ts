import {
  CreditCard,
  Award,
  Shield,
  HelpCircle,
  Target,
  TrendingUp,
  Settings,
} from 'lucide-react-native';

export const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: CreditCard, label: 'Subscriptions & Billing', color: '#818CF8', bg: '#1E1B4B' },
      { icon: Award, label: 'My Certificates', color: '#F59E0B', bg: '#2D1A00' },
      { icon: Target, label: 'Target Careers', color: '#10B981', bg: '#022C22' },
      { icon: TrendingUp, label: 'Performance Reports', color: '#0EA5E9', bg: '#0C1A29' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Shield, label: 'Security & Privacy', color: '#A78BFA', bg: '#1E0B3A' },
      { icon: Settings, label: 'App Settings', color: '#64748B', bg: '#1A1A2E' },
    ],
  },
  {
    title: 'Support',
    items: [{ icon: HelpCircle, label: 'Help Center', color: '#0EA5E9', bg: '#0C1A29' }],
  },
];
