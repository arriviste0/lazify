'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import styles from './HorizontalScrollCarousel.module.css';
import {
  PenLine,
  ListTodo,
  Mail,
  CalendarClock,
  Users,
  Wallet,
  ShoppingCart
} from 'lucide-react';

const agents = [
    {
        id: 'contentcraft',
        name: 'ContentCraft AI',
        description: 'Automated content creation for blogs, social media, and marketing campaigns.',
        Icon: PenLine,
    },
    {
        id: 'taskmaster',
        name: 'TaskMaster AI',
        description: 'Intelligent to-do lists and project management to keep you on track.',
        Icon: ListTodo,
    },
    {
        id: 'inboxzero',
        name: 'InboxZero AI',
        description: 'Smart email filtering and summarization to conquer your inbox.',
        Icon: Mail,
    },
    {
        id: 'schedulesync',
        name: 'ScheduleSync AI',
        description: 'AI-powered meeting scheduling and calendar management.',
        Icon: CalendarClock,
    },
    {
        id: 'leadspark',
        name: 'LeadSpark AI',
        description: 'Automated lead generation and qualification for your sales team.',
        Icon: Users,
    },
    {
        id: 'financetracker',
        name: 'FinanceTracker AI',
        description: 'Tracks expenses, auto-categorizes, and provides savings tips.',
        Icon: Wallet,
    },
    {
        id: 'shopsmart',
        name: 'ShopSmart AI',
        description: 'Recommends products, handles FAQs, and analyzes checkout funnel.',
        Icon: ShoppingCart,
    },
];

const parallaxClasses = [
    styles.slower,
    styles.faster,
    styles.vertical,
    styles.slowerDown,
    styles.faster1,
    styles.slower,
    styles.vertical,
];

const HorizontalScrollCarousel = () => {
    return (
        <div className={styles.external}>
            <div className={styles.horizontalScrollWrapper}>
                {agents.map((agent, index) => {
                    const Icon = agent.Icon;
                    return (
                        <div key={agent.name} className={`${styles.imgWrapper} ${parallaxClasses[index % parallaxClasses.length]}`}>
                            <div className={styles.card}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '24px 0 12px 0' }}>
                                    <Icon size={48} strokeWidth={2.2} />
                                </div>
                                <div className={styles.cardContent}>
                                    <h3>{agent.name}</h3>
                                    <p>{agent.description}</p>
                                    <Button asChild className={styles.demoButton}>
                                        <Link href={`/interactive-agents/${agent.id}`}>Try Demo</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HorizontalScrollCarousel; 