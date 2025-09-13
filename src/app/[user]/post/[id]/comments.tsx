import { ArrowLeft } from 'lucide-react'
import { BookmarkIcon, DotIcon, MessageCircle, HeartIcon, BarChart2, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
const Comments = () => {

    const CommentLogs = [
        {
            name: "Atunde Komolafe",
            username: "Atunde234_",
            icon: "/images/cat_nft.jpg",
            comment: "Wow! This property looks amazing. The design and location are perfect for a modern lifestyle. Definitely worth considering for my next investment.",
            like: 23,
            reply: 5,
            impression: 100,
            bookmark: 2
        },
        {
            name: "Elon Musk",
            username: "Elon",
            icon: "/images/monkey.jpg",
            comment: "Can I pay installmentally?",
            like: 45,
            reply: 12,
            impression: 500,
            bookmark: 8
        },
        {
            name: "Gay Qudus",
            username: "Phoenix",
            icon: "/images/grilie.jpg",
            comment: "I love the neighborhood vibe. Does it have a gym or swimming pool?",
            like: 19,
            reply: 3,
            impression: 210,
            bookmark: 5
        },
        {
            name: "Amaka Johnson",
            username: "AmakaJ",
            icon: "/images/cat_nft.jpg",
            comment: "The price seems fair for the features included. I’d like to schedule a tour this weekend.",
            like: 34,
            reply: 7,
            impression: 320,
            bookmark: 10
        },
        {
            name: "David Chen",
            username: "DaveC",
            icon: "/images/monkey.jpg",
            comment: "Is this property pet-friendly? I have two dogs and that’s a major factor for me.",
            like: 15,
            reply: 2,
            impression: 180,
            bookmark: 3
        },
        {
            name: "Sophia Martins",
            username: "SophieM",
            icon: "/images/cat_nft.jpg",
            comment: "The kitchen space looks incredible. Honestly, this might be my dream home 😍",
            like: 52,
            reply: 9,
            impression: 600,
            bookmark: 14
        }
    ]


    return (
        <div className='w-full mb-[70px] lg:mb-0'>

            {CommentLogs.map((comment, index) => (

                <div className='w-full flex justify-between items-start gap-3 mt-5 mb-3 border-b border-[#31313199]' key={index}>
                    <Link href={`/${comment.username}`}>
                        <div className='flex-shrink-0 ml-3'>
                            <Image src={comment.icon} className='rounded-full' width={30} height={30} alt='.' />
                        </div>
                    </Link>
                    <div className='flex-1 pb-2 pr-2'>
                        <div className='w-full flex items-start justify-between'>

                            <Link href={`/${comment.username}`}>
                                <div className='flex items-start justify-start gap-1 mb-2'>
                                    <h3 className='font-bold text-[12px] md:text-sm'>{comment.name}</h3>
                                    <h3 className='text-[#8899] text-[12px] md:text-sm'>@{comment.username}</h3>
                                </div>
                            </Link>

                        </div>

                        <div className='mt-1'>
                            <p> {comment.comment}</p>
                        </div>


                 
                    </div>
                </div>

            ))
            }

        </div >
    )
}

export default Comments
