'use client';

import { Separator } from '@/components/ui/separator';
import { TERMS } from '@/constants/auth';
import { useState } from 'react';
import AllAgreeCheckbox from '../components/all-agree-checkbox';
import AgreementCheckbox from '../components/agreement-checkbox';
import SignupButton from '../components/signup-button';

export default function TermsAgreements() {
  
  const [terms, setTerms] = useState<typeof TERMS>(TERMS);

  const isAllAgreed = terms.every((term) => term.isAgreed);
  const canSignup = terms.filter((term) => term.isRequired).every((term) => term.isAgreed);

  const handleClickTerm = (index: number) => {
    setTerms(terms.map((term, i) => i === index ? { ...term, isAgreed: !term.isAgreed } : term));
  };
  const handleAllAgreedChange = () => {
    const allAgreed = terms.every((term) => term.isAgreed);
    setTerms(terms.map((term) => ({ ...term, isAgreed: !allAgreed })))
  };
  const handleClickSignup = () => {
    console.log('signup');
  };

  return (
      <div>
        <AllAgreeCheckbox checked={isAllAgreed} onCheckedChange={handleAllAgreedChange} />
        <Separator className='my-4' />

        <section className="flex flex-col gap-2.5 mb-10">
          {terms.map((term, index) => (
            <AgreementCheckbox key={term.label} checked={term.isAgreed} onCheckedChange={() => handleClickTerm(index)} label={term.label} isRequired={term.isRequired} />
          ))}
        </section>

        <SignupButton disabled={!canSignup} onClick={handleClickSignup} />
      </div>
  );
}
