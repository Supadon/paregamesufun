import DonateSection from '@/components/DonateSection'

export const metadata = {
  title: 'สนับสนุนผู้แปล — แปลเกมสู่ฝัน',
  description: 'ร่วมสนับสนุนนักแปลอิสระ แปลเกมสู่ฝัน เพื่อเป็นทุนค่ากาแฟ ค่าไฟ และจัดซื้อตัวเกมลิขสิทธิ์สำหรับพัฒนาแปลไทย ฟรี 100%',
}

export default function DonatePage() {
  return (
    <div className="max-w-[780px] mx-auto px-6 pt-28 pb-20">
      <DonateSection variant="standalone" />
    </div>
  )
}
