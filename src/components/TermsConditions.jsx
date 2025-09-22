import React from 'react';

const TermsConditions = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-amber-700">Terms & Conditions</h1>

      <ul className="list-disc pl-5 space-y-4">
        <li>All products are handmade; slight variations in design or shade may occur.</li>
        <li>Once confirmed, orders cannot be canceled or modified after 24 hours.</li>
        <li>For Cash on Delivery, **50% advance payment is mandatory**. Remaining 50% is paid on delivery.</li>
        <li>Estimated delivery time is **11–15 working days** within Pakistan.</li>
        <li>We reserve the right to cancel any suspicious or incomplete orders.</li>
      </ul>

      <p className="mt-6 text-sm text-gray-500">
        Use of this website implies acceptance of all terms mentioned above.
      </p>
    </div>
  );
};

export default TermsConditions;
