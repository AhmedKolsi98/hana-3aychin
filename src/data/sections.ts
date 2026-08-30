import {
  Zap, Droplets, ThermometerSun, UtensilsCrossed, Laptop,
  PhoneCall, Flame, Wind, Info, Home, type LucideIcon,
} from 'lucide-react';

export interface SectionDef {
  id: string;
  path: string;
  title: string;
  sub: string;
  icon: LucideIcon;
}

export const SECTIONS: SectionDef[] = [
  { id: 'electricity', path: '/electricity', title: 'الكهرباء وحماية الأجهزة', sub: 'ريليه الحماية، صيانة المكيف، والتعويض من STEG', icon: Zap },
  { id: 'water', path: '/water', title: 'الماء: التخزين والتطهير', sub: 'تطهير الماجل بالجافيل وأجهزة التناضح العكسي', icon: Droplets },
  { id: 'health', path: '/health', title: 'الصحة والحرّ الشديد', sub: 'الأطفال والمسنّون، ضربة الشمس، والأنسولين', icon: ThermometerSun },
  { id: 'food', path: '/food', title: 'الأمن الغذائي والحفظ', sub: 'قواعد الثلاجة، وعاء الزير، والقَديد', icon: UtensilsCrossed },
  { id: 'work', path: '/work', title: 'العمل عن بُعد', sub: 'تكرارية في الطاقة والاتصال', icon: Laptop },
  { id: 'apps-contacts', path: '/apps-contacts', title: 'تطبيقات وأرقام الطوارئ', sub: 'فمّا ضوء، وينو الضوء، وكل الأرقام الحرجة', icon: PhoneCall },
  { id: 'light-security', path: '/light-security', title: 'الإضاءة والأمن', sub: 'مصباح الزيت المنزلي والإنذارات الشمسية', icon: Flame },
  { id: 'passive-cooling', path: '/passive-cooling', title: 'التبريد السلبي والعمارة', sub: 'حكمة الأجداد لبيت أبرد دون كهرباء', icon: Wind },
  { id: 'about', path: '/about', title: 'حول المشروع', sub: 'مفتوح المصدر — المبادئ والمصادر والمساهمة', icon: Info },
];

export const HOME_ICON = Home;

export interface EmergencyContact {
  name: string;
  number: string;
  tel: string;
}

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { name: 'الحماية المدنية', number: '198', tel: 'tel:198' },
  { name: 'الإسعاف SAMU', number: '190', tel: 'tel:190' },
  { name: 'شرطة النجدة', number: '197', tel: 'tel:197' },
  { name: 'الحرس الوطني', number: '193', tel: 'tel:193' },
  { name: 'مركز السموم', number: '71 335 500', tel: 'tel:+21671335500' },
];
