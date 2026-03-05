'use client';

import { Separator } from '@/components/ui/separator';
import { TERMS } from '@/constants/auth';
import { useState } from 'react';
import AllAgreeCheckbox from '../components/all-agree-checkbox';
import AgreementCheckbox from '../components/agreement-checkbox';
import SignupButton from '../components/signup-button';

const initialTerms = TERMS.map(term => ({ ...term, isAgreed: false }));

export default function TermsAgreements() {
  const [terms, setTerms] = useState(initialTerms);

  const isAllAgreed = terms.every((term) => term.isAgreed);
  const canSignup = terms.filter((term) => term.isRequired).every((term) => term.isAgreed);

  const handleClickTerm = (index: number) => {
  setTerms((prev) =>
    prev.map((term, i) => i === index ? { ...term, isAgreed: !term.isAgreed } : term)
  );
};

const handleAllAgreedChange = () => {
  setTerms((prev) => {
    const allAgreed = prev.every((term) => term.isAgreed);
    return prev.map((term) => ({ ...term, isAgreed: !allAgreed }));
  });
};
  const handleSubmit = () => {
    console.log('signup');
  };

  return (
      <form onSubmit={handleSubmit}>
        <AllAgreeCheckbox checked={isAllAgreed} onCheckedChange={handleAllAgreedChange} />
        <Separator className='my-4' />

        <section className="flex flex-col gap-2.5 mb-10">
          {terms.map((term, index) => (
            <AgreementCheckbox key={term.id} checked={term.isAgreed} onCheckedChange={() => handleClickTerm(index)} label={term.label} isRequired={term.isRequired} />
          ))}
        </section>

        <SignupButton disabled={!canSignup} />
      </form>
  );
}
