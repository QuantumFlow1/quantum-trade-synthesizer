
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, ChevronDown, ChevronRight, FileText, GitBranch, Lightbulb, TrendingUp, Users } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface GuideSection {
  title: string;
  content: string[];
}

interface Guide {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  color: string;
  sections: GuideSection[];
}

const guides: Guide[] = [
  {
    id: 'financial-modeling',
    title: 'Financial Modeling',
    icon: TrendingUp,
    description: 'Comprehensive guide to building financial models for startups',
    color: 'blue',
    sections: [
      {
        title: 'Foundational Principles',
        content: [
          'Start with clear assumptions',
          'Build from the bottom up',
          'Focus on key drivers',
          'Maintain consistency across projections',
          'Enable scenario analysis'
        ]
      },
      {
        title: 'Revenue Projections',
        content: [
          'Define clear revenue streams',
          'Identify key growth drivers',
          'Model customer acquisition',
          'Analyze cohort behavior',
          'Project pricing evolution'
        ]
      },
      {
        title: 'Cost Structure',
        content: [
          'Separate fixed vs. variable costs',
          'Project headcount needs',
          'Calculate unit economics',
          'Analyze contribution margins',
          'Project operational efficiency gains'
        ]
      },
      {
        title: 'Financial Statements',
        content: [
          'Develop integrated P&L',
          'Project cash flow statement',
          'Build balance sheet projections',
          'Calculate key metrics',
          'Identify cash needs'
        ]
      },
      {
        title: 'Investment Analysis',
        content: [
          'Calculate burn rate',
          'Determine runway',
          'Project fundraising needs',
          'Analyze dilution scenarios',
          'Calculate return potential'
        ]
      }
    ]
  },
  {
    id: 'pitch-deck',
    title: 'Pitch Deck Guide',
    icon: FileText,
    description: 'The EdriziAI-info approach to creating compelling pitch decks',
    color: 'green',
    sections: [
      {
        title: 'Core Principles',
        content: [
          'First Principles Thinking',
          'Story Structure',
          'Investor Psychology'
        ]
      },
      {
        title: 'Essential Slides',
        content: [
          'Problem & Solution (2-3 slides)',
          'Market Opportunity (2 slides)',
          'Business Model (1-2 slides)',
          'Traction & Metrics (1-2 slides)',
          'Team & Vision (1-2 slides)'
        ]
      },
      {
        title: 'Presentation Strategy',
        content: [
          'Opening Strong',
          'Maintaining Interest',
          'Closing Strong'
        ]
      },
      {
        title: 'Common Pitfalls',
        content: [
          'Content Issues',
          'Design Issues',
          'Delivery Problems'
        ]
      },
      {
        title: 'Specialized Sections',
        content: [
          'For Technical Products',
          'For Regulated Industries',
          'For Platform Businesses'
        ]
      },
      {
        title: 'Fundraising Context',
        content: [
          'Pre-Seed/Seed',
          'Series A',
          'Series B+'
        ]
      }
    ]
  },
  {
    id: 'startup-fundamentals',
    title: 'Startup Fundamentals',
    icon: Lightbulb,
    description: 'Essential principles for building successful startups',
    color: 'purple',
    sections: [
      {
        title: 'First Principles of Startup Building',
        content: [
          'Problem Validation',
          'Market Understanding',
          'Solution Development',
          'Customer Development',
          'Business Model'
        ]
      },
      {
        title: 'Key Success Metrics',
        content: [
          'Early Stage (Years 1-3)',
          'Growth Stage (Years 4-7)',
          'Scale Stage (Years 7-10)'
        ]
      },
      {
        title: 'Common Pitfalls to Avoid',
        content: [
          'Market Focus',
          'Execution Mistakes',
          'Growth Challenges'
        ]
      },
      {
        title: 'Decision-Making Framework',
        content: [
          'When to Pivot',
          'When to Scale'
        ]
      },
      {
        title: 'Resource Allocation',
        content: [
          'Early Stage',
          'Growth Stage',
          'Scale Stage'
        ]
      }
    ]
  },
  {
    id: 'team-building',
    title: 'Team Building',
    icon: Users,
    description: 'Comprehensive guide to building and scaling teams',
    color: 'amber',
    sections: [
      {
        title: 'Leadership Evolution',
        content: [
          'Chief Doer Phase (<50 employees)',
          'Chief Delegator Phase (50+ employees)',
          'Leadership Transition'
        ]
      },
      {
        title: 'Team Development',
        content: [
          'Early Stage Team',
          'Growth Stage Team',
          'Scale Stage Team'
        ]
      },
      {
        title: 'Hiring Strategy',
        content: [
          'Talent Identification',
          'Recruitment Process',
          'Onboarding Program'
        ]
      },
      {
        title: 'Cultural Foundation',
        content: [
          'Core Values',
          'Communication',
          'Team Dynamics'
        ]
      },
      {
        title: 'Performance Management',
        content: [
          'Goal Setting',
          'Feedback Systems',
          'Career Development'
        ]
      },
      {
        title: 'Remote Teams',
        content: [
          'Remote Structure',
          'Remote Culture',
          'Remote Management'
        ]
      },
      {
        title: 'Scaling Teams',
        content: [
          'Department Building',
          'Process Development',
          'Knowledge Management'
        ]
      }
    ]
  }
];

const getColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
    green: 'bg-green-500/10 text-green-600 hover:bg-green-500/20',
    red: 'bg-red-500/10 text-red-600 hover:bg-red-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20',
    purple: 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20',
    amber: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20',
  };
  
  return colorMap[color] || 'bg-slate-500/10 text-slate-600 hover:bg-slate-500/20';
};

const GuideResourcesTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('guides');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  const handleGuideSelect = (guide: Guide) => {
    setSelectedGuide(guide);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <span>Guides</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            <span>Resources</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>EdriziAI Guides</CardTitle>
                  <CardDescription>
                    Comprehensive guides for startup founders and teams
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {guides.map((guide) => (
                      <div
                        key={guide.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors",
                          selectedGuide?.id === guide.id 
                            ? getColorClass(guide.color)
                            : "hover:bg-muted"
                        )}
                        onClick={() => handleGuideSelect(guide)}
                      >
                        <guide.icon className="h-5 w-5" />
                        <span className="font-medium">{guide.title}</span>
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              {selectedGuide ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-md", 
                        getColorClass(selectedGuide.color)
                      )}>
                        <selectedGuide.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>{selectedGuide.title}</CardTitle>
                        <CardDescription>{selectedGuide.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {selectedGuide.sections.map((section, index) => (
                        <AccordionItem key={index} value={`section-${index}`}>
                          <AccordionTrigger className="text-left">
                            {section.title}
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2 ml-6 list-disc">
                              {section.content.map((item, i) => (
                                <li key={i} className="text-muted-foreground">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <Book className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a Guide</h3>
                    <p className="text-muted-foreground">
                      Choose a guide from the list to view its content
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Card>
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Resources Coming Soon</h3>
              <p className="text-muted-foreground">
                Additional resources will be available in future updates
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <Card>
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Templates Coming Soon</h3>
              <p className="text-muted-foreground">
                Downloadable templates will be available in future updates
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuideResourcesTab;
