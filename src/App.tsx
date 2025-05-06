import './index.css'
import { Disc3, House } from 'lucide-react';

export default function App(){
    return (
    <div className='bg-zinc-900 w-screen h-screen flex flex-row'>
        <div className='my-4 ml-4 w-100 h-[100vh-1rem] bg-zinc-700 rounded-2xl'>
            <div className='flex flex-row gap-4 py-6 px-8 text-white items-center hover:bg-zinc-500 transition-colors rounded-2xl cursor-pointer'>
                <House />
                <h1 className='font-bold text-2xl'>Home</h1>
            </div>
            <div className='flex flex-row gap-4 py-6 px-8 text-white items-center hover:bg-zinc-500 transition-colors rounded-2xl cursor-pointer'>
                <Disc3 />
                <h1 className='font-bold text-2xl'>Musics</h1>
            </div>
        </div>
        <div className='bg-zinc-700 rounded-2xl w-full h-[100%-1rem] m-4 p-8'>
            <h1>oioioi</h1>
        </div>
    </div>
    )
}