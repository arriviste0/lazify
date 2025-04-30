import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, User, CheckCircle, Phone, Mail } from 'lucide-react';
import { Separator } from './ui/separator';

interface LeadCardProps {
  companyName: string;
  contactPerson: string;
  relevanceScore: number;
  contactNumber?: string;
  email?: string;
}

// Function to determine badge color based on score
const getBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (score >= 75) return 'default'; // High relevance - Primary color
  if (score >= 50) return 'secondary'; // Medium relevance - Secondary/Muted color
  return 'outline'; // Low relevance - Outline or lighter variant
};

export function LeadCard({ companyName, contactPerson, relevanceScore, contactNumber, email }: LeadCardProps) {
  const badgeVariant = getBadgeVariant(relevanceScore);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 bg-card flex flex-col justify-between">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Briefcase className="h-5 w-5 text-primary" />
          {companyName || 'N/A'}
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
          <User className="h-4 w-4" />
          {contactPerson || 'N/A'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {(contactNumber || email) && (
          <>
           <Separator />
            <div className="space-y-2 text-sm text-muted-foreground">
              {contactNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{contactNumber}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${email}`} className="hover:text-primary hover:underline truncate">
                    {email}
                  </a>
                </div>
              )}
            </div>
            <Separator />
          </>
        )}

         <div className="flex items-center justify-between pt-2">
             <div className="flex items-center gap-1 text-sm text-muted-foreground">
               <CheckCircle className="h-4 w-4 text-accent"/>
                <span>Relevance</span>
             </div>
            <Badge variant={badgeVariant} className="text-xs font-semibold">
              {relevanceScore}%
            </Badge>
          </div>
      </CardContent>
    </Card>
  );
}
