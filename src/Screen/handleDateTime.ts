import firestore from '@react-native-firebase/firestore';
const monthName=[
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]
export class handleDateTime{
    static DateString=(num:number)=>{
        const date=new Date(num)
        return` ${date.getDate()} ${monthName[date.getMonth()]} ${date.getFullYear()}`
    }
    static DateToString=()=>{
        const date=new Date()
        return` ${date.getDate()} ${monthName[date.getMonth()]} ${date.getFullYear()}`
    }
    static GetHour=(num:any)=>{
        const startDate: Date = new firestore.Timestamp(num.seconds, num.nanoseconds).toDate();

        
        // Lấy giờ kèm theo AM/PM
        const options: Intl.DateTimeFormatOptions = { 
            hour: "2-digit", 
            minute: "2-digit", 
            hour12: true 
          };
        const startTime:string = startDate.toLocaleTimeString('en-US', options); // Sẽ có AM/PM
        return startTime
    }
}