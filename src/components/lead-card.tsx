import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, User, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';
import { Separator } from './ui/separator';
import Link from 'next/link'; // Import Link for client-side navigation

interface LeadCardProps {
  companyName: string;
  contactPerson: string;
  relevanceScore: number;
  contactNumber?: string;
  email?: string;
  location?: string; // Added location prop
}

// Function to determine badge color based on score
const getBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (score >= 75) return 'default'; // High relevance - Primary color
  if (score >= 50) return 'secondary'; // Medium relevance - Secondary/Muted color
  return 'outline'; // Low relevance - Outline or lighter variant
};

export function LeadCard({ companyName, contactPerson, relevanceScore, contactNumber, email, location }: LeadCardProps) {
  const badgeVariant = getBadgeVariant(relevanceScore);

  const googleMapsUrl = location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
    : null;

  return (
    <Card className="shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-200 bg-card flex flex-col justify-between h-full border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-primary">
          <Briefcase className="h-5 w-5 text-primary" />
          {companyName || 'N/A'}
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
          <User className="h-4 w-4" />
          {contactPerson || 'N/A'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-3 flex flex-col flex-grow">
        {(contactNumber || email || location) && (
          <>
            <Separator />
            <div className="space-y-2 text-sm text-muted-foreground">
              {contactNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <a href={`tel:${contactNumber}`} className="hover:text-primary hover:underline break-all">
                    {contactNumber}
                  </a>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-primary hover:underline truncate break-all">
                    {email}
                  </a>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{location}</span>
                </div>
              )}
            </div>
            <Separator />
          </>
        )}

        <div className="flex-grow"></div> {/* Spacer to push content to bottom */}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-accent"/>
            <span>Relevance</span>
          </div>
          <Badge variant={badgeVariant} className="text-xs font-semibold">
            {relevanceScore}%
          </Badge>
        </div>
         {googleMapsUrl && (
          <Button variant="outline" size="sm" className="w-full mt-3" asChild>
            <Link href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <MapPin className="mr-2 h-4 w-4" />
              View on Map
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
