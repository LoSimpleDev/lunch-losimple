import { useEffect } from 'react';

interface HowToStep {
  name: string;
  text: string;
}

interface HowToSchemaProps {
  title: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
  estimatedCost?: {
    currency: string;
    value: string;
  };
  image?: string;
}

export function HowToSchema({ 
  title, 
  description, 
  steps, 
  totalTime,
  estimatedCost,
  image 
}: HowToSchemaProps) {
  useEffect(() => {
    const howToSchema: Record<string, any> = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": title,
      "description": description,
      "step": steps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.name,
        "text": step.text
      })),
      "inLanguage": "es-EC"
    };

    if (totalTime) {
      howToSchema.totalTime = totalTime;
    }

    if (estimatedCost) {
      howToSchema.estimatedCost = {
        "@type": "MonetaryAmount",
        "currency": estimatedCost.currency,
        "value": estimatedCost.value
      };
    }

    if (image) {
      howToSchema.image = image;
    }

    const existingScript = document.querySelector('script[data-schema-id="howto-schema"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema-id', 'howto-schema');
    script.textContent = JSON.stringify(howToSchema);
    document.head.appendChild(script);

    return () => {
      const script = document.querySelector('script[data-schema-id="howto-schema"]');
      if (script) {
        script.remove();
      }
    };
  }, [title, description, steps, totalTime, estimatedCost, image]);

  return null;
}
