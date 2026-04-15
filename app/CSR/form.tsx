'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type FormData = {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  country: string; // stored as 2-letter ISO code (e.g. "FR")
  province?: string;
  city: string;
  county?: string;
  phone?: string;
  postcode: string;
  email: string;
  consigneeId?: string;
};

export default function ShippingForm({
  onSuccess,
  onCancel,
  initial = null,
}: {
  onSuccess?: (created: any) => void;
  onCancel?: () => void;
  initial?: Partial<FormData> | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    firstName: initial?.firstName ?? '',
    lastName: initial?.lastName ?? '',
    address1: initial?.address1 ?? '',
    address2: initial?.address2 ?? '',
    country: initial?.country ?? '', // expect two-letter code here if provided
    province: initial?.province ?? '',
    city: initial?.city ?? '',
    county: initial?.county ?? '',
    phone: initial?.phone ?? '',
    postcode: initial?.postcode ?? '',
    email: initial?.email ?? '',
    consigneeId: initial?.consigneeId ?? '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const update = (k: keyof FormData, v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  const validate = (): string | null => {
    if (!form.firstName.trim()) return 'First name is required';
    if (!form.lastName.trim()) return 'Last name is required';
    if (!form.address1.trim()) return 'Address1 is required';
    if (!form.country.trim()) return 'Country is required';
    if (!form.city.trim()) return 'City is required';
    if (!form.postcode.trim()) return 'Postcode is required';
    if (!form.email.trim()) return 'Email is required';
    // basic email check
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Email is invalid';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/dbcustomer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      console.log(JSON.stringify(form));

      const data = await res.json();
      if (!res.ok) {
        setError(data?.message ?? 'Failed to save customer');
      } else {
        setSuccessMsg('Saved successfully');
        onSuccess?.({ saved: data, shipping: form });
        // optional: router.push('/checkout/confirm');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      country: '',
      province: '',
      city: '',
      county: '',
      phone: '',
      postcode: '',
      email: '',
      consigneeId: '',
    });
    setError(null);
    setSuccessMsg(null);
    onCancel?.();
  };

  // Extended country list (ISO 3166-1 alpha-2 codes). PayPal expects two-letter codes.
  // Preferred ones are listed near the top.
  const COUNTRIES: { code: string; name: string }[] = [
    // preferred / common
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' }, // PayPal uses GB for UK
    { code: 'MA', name: 'Morocco' },
    { code: 'FR', name: 'France' },
    { code: 'CA', name: 'Canada' },
    { code: 'ES', name: 'Spain' },
    { code: 'DE', name: 'Germany' },
    { code: 'CN', name: 'China' },
    { code: 'RU', name: 'Russia' },
    { code: 'TR', name: 'Turkey' },

    // Large list (common countries) — de-duplicated
    { code: 'AF', name: 'Afghanistan' },
    { code: 'AL', name: 'Albania' },
    { code: 'DZ', name: 'Algeria' },
    { code: 'AS', name: 'American Samoa' },
    { code: 'AD', name: 'Andorra' },
    { code: 'AO', name: 'Angola' },
    { code: 'AI', name: 'Anguilla' },
    { code: 'AQ', name: 'Antarctica' },
    { code: 'AG', name: 'Antigua and Barbuda' },
    { code: 'AR', name: 'Argentina' },
    { code: 'AM', name: 'Armenia' },
    { code: 'AW', name: 'Aruba' },
    { code: 'AU', name: 'Australia' },
    { code: 'AT', name: 'Austria' },
    { code: 'AZ', name: 'Azerbaijan' },
    { code: 'BS', name: 'Bahamas' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'BB', name: 'Barbados' },
    { code: 'BY', name: 'Belarus' },
    { code: 'BE', name: 'Belgium' },
    { code: 'BZ', name: 'Belize' },
    { code: 'BJ', name: 'Benin' },
    { code: 'BM', name: 'Bermuda' },
    { code: 'BT', name: 'Bhutan' },
    { code: 'BO', name: 'Bolivia' },
    { code: 'BA', name: 'Bosnia and Herzegovina' },
    { code: 'BW', name: 'Botswana' },
    { code: 'BR', name: 'Brazil' },
    { code: 'IO', name: 'British Indian Ocean Territory' },
    { code: 'BN', name: 'Brunei' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'BF', name: 'Burkina Faso' },
    { code: 'BI', name: 'Burundi' },
    { code: 'KH', name: 'Cambodia' },
    { code: 'CM', name: 'Cameroon' },
    { code: 'CV', name: 'Cape Verde' },
    { code: 'KY', name: 'Cayman Islands' },
    { code: 'CF', name: 'Central African Republic' },
    { code: 'TD', name: 'Chad' },
    { code: 'CL', name: 'Chile' },
    { code: 'CO', name: 'Colombia' },
    { code: 'KM', name: 'Comoros' },
    { code: 'CR', name: 'Costa Rica' },
    { code: 'CI', name: "Côte d'Ivoire" },
    { code: 'HR', name: 'Croatia' },
    { code: 'CU', name: 'Cuba' },
    { code: 'CW', name: 'Curaçao' },
    { code: 'CY', name: 'Cyprus' },
    { code: 'CZ', name: 'Czechia' },
    { code: 'CD', name: 'Congo (DRC)' },
    { code: 'CG', name: 'Congo (Republic)' },
    { code: 'DK', name: 'Denmark' },
    { code: 'DJ', name: 'Djibouti' },
    { code: 'DM', name: 'Dominica' },
    { code: 'DO', name: 'Dominican Republic' },
    { code: 'EC', name: 'Ecuador' },
    { code: 'EG', name: 'Egypt' },
    { code: 'SV', name: 'El Salvador' },
    { code: 'GQ', name: 'Equatorial Guinea' },
    { code: 'ER', name: 'Eritrea' },
    { code: 'EE', name: 'Estonia' },
    { code: 'ET', name: 'Ethiopia' },
    { code: 'FK', name: 'Falkland Islands' },
    { code: 'FO', name: 'Faroe Islands' },
    { code: 'FJ', name: 'Fiji' },
    { code: 'FI', name: 'Finland' },
    { code: 'GF', name: 'French Guiana' },
    { code: 'PF', name: 'French Polynesia' },
    { code: 'GA', name: 'Gabon' },
    { code: 'GM', name: 'Gambia' },
    { code: 'GE', name: 'Georgia' },
    { code: 'GH', name: 'Ghana' },
    { code: 'GI', name: 'Gibraltar' },
    { code: 'GR', name: 'Greece' },
    { code: 'GL', name: 'Greenland' },
    { code: 'GD', name: 'Grenada' },
    { code: 'GP', name: 'Guadeloupe' },
    { code: 'GU', name: 'Guam' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'GN', name: 'Guinea' },
    { code: 'GW', name: 'Guinea-Bissau' },
    { code: 'GY', name: 'Guyana' },
    { code: 'HT', name: 'Haiti' },
    { code: 'HN', name: 'Honduras' },
    { code: 'HK', name: 'Hong Kong' },
    { code: 'HU', name: 'Hungary' },
    { code: 'IS', name: 'Iceland' },
    { code: 'IN', name: 'India' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'IR', name: 'Iran' },
    { code: 'IQ', name: 'Iraq' },
    { code: 'IE', name: 'Ireland' },
    { code: 'IL', name: 'Israel' },
    { code: 'IT', name: 'Italy' },
    { code: 'JM', name: 'Jamaica' },
    { code: 'JP', name: 'Japan' },
    { code: 'JO', name: 'Jordan' },
    { code: 'KZ', name: 'Kazakhstan' },
    { code: 'KE', name: 'Kenya' },
    { code: 'KI', name: 'Kiribati' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'KG', name: 'Kyrgyzstan' },
    { code: 'LA', name: 'Laos' },
    { code: 'LV', name: 'Latvia' },
    { code: 'LB', name: 'Lebanon' },
    { code: 'LS', name: 'Lesotho' },
    { code: 'LR', name: 'Liberia' },
    { code: 'LY', name: 'Libya' },
    { code: 'LI', name: 'Liechtenstein' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'MO', name: 'Macao' },
    { code: 'MK', name: 'North Macedonia' },
    { code: 'MG', name: 'Madagascar' },
    { code: 'MW', name: 'Malawi' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'MV', name: 'Maldives' },
    { code: 'ML', name: 'Mali' },
    { code: 'MT', name: 'Malta' },
    { code: 'MH', name: 'Marshall Islands' },
    { code: 'MQ', name: 'Martinique' },
    { code: 'MR', name: 'Mauritania' },
    { code: 'MU', name: 'Mauritius' },
    { code: 'YT', name: 'Mayotte' },
    { code: 'MX', name: 'Mexico' },
    { code: 'FM', name: 'Micronesia' },
    { code: 'MD', name: 'Moldova' },
    { code: 'MC', name: 'Monaco' },
    { code: 'MN', name: 'Mongolia' },
    { code: 'ME', name: 'Montenegro' },
    { code: 'MS', name: 'Montserrat' },
    { code: 'MZ', name: 'Mozambique' },
    { code: 'MM', name: 'Myanmar' },
    { code: 'NA', name: 'Namibia' },
    { code: 'NR', name: 'Nauru' },
    { code: 'NP', name: 'Nepal' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'NC', name: 'New Caledonia' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'NI', name: 'Nicaragua' },
    { code: 'NE', name: 'Niger' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'NU', name: 'Niue' },
    { code: 'NF', name: 'Norfolk Island' },
    { code: 'KP', name: 'North Korea' },
    { code: 'NO', name: 'Norway' },
    { code: 'OM', name: 'Oman' },
    { code: 'PK', name: 'Pakistan' },
    { code: 'PW', name: 'Palau' },
    { code: 'PA', name: 'Panama' },
    { code: 'PG', name: 'Papua New Guinea' },
    { code: 'PY', name: 'Paraguay' },
    { code: 'PE', name: 'Peru' },
    { code: 'PH', name: 'Philippines' },
    { code: 'PL', name: 'Poland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'PR', name: 'Puerto Rico' },
    { code: 'QA', name: 'Qatar' },
    { code: 'RE', name: 'Réunion' },
    { code: 'RO', name: 'Romania' },
    { code: 'RW', name: 'Rwanda' },
    { code: 'BL', name: 'Saint Barthélemy' },
    { code: 'KN', name: 'Saint Kitts and Nevis' },
    { code: 'LC', name: 'Saint Lucia' },
    { code: 'MF', name: 'Saint Martin (French part)' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines' },
    { code: 'WS', name: 'Samoa' },
    { code: 'SM', name: 'San Marino' },
    { code: 'ST', name: 'Sao Tome and Principe' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'SN', name: 'Senegal' },
    { code: 'RS', name: 'Serbia' },
    { code: 'SC', name: 'Seychelles' },
    { code: 'SL', name: 'Sierra Leone' },
    { code: 'SG', name: 'Singapore' },
    { code: 'SX', name: 'Sint Maarten (Dutch part)' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'SB', name: 'Solomon Islands' },
    { code: 'SO', name: 'Somalia' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'KR', name: 'South Korea' },
    { code: 'SS', name: 'South Sudan' },
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'SD', name: 'Sudan' },
    { code: 'SR', name: 'Suriname' },
    { code: 'SJ', name: 'Svalbard and Jan Mayen' },
    { code: 'SZ', name: 'Eswatini' },
    { code: 'SE', name: 'Sweden' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'SY', name: 'Syria' },
    { code: 'TW', name: 'Taiwan' },
    { code: 'TJ', name: 'Tajikistan' },
    { code: 'TZ', name: 'Tanzania' },
    { code: 'TH', name: 'Thailand' },
    { code: 'TL', name: 'Timor-Leste' },
    { code: 'TG', name: 'Togo' },
    { code: 'TK', name: 'Tokelau' },
    { code: 'TO', name: 'Tonga' },
    { code: 'TT', name: 'Trinidad and Tobago' },
    { code: 'TN', name: 'Tunisia' },
    { code: 'TM', name: 'Turkmenistan' },
    { code: 'TC', name: 'Turks and Caicos Islands' },
    { code: 'TV', name: 'Tuvalu' },
    { code: 'UG', name: 'Uganda' },
    { code: 'UA', name: 'Ukraine' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'UZ', name: 'Uzbekistan' },
    { code: 'VU', name: 'Vanuatu' },
    { code: 'VA', name: 'Vatican City' },
    { code: 'VE', name: 'Venezuela' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'VG', name: 'British Virgin Islands' },
    { code: 'VI', name: 'U.S. Virgin Islands' },
    { code: 'EH', name: 'Western Sahara' },
    { code: 'YE', name: 'Yemen' },
    { code: 'ZM', name: 'Zambia' },
    { code: 'ZW', name: 'Zimbabwe' },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white rounded-lg shadow p-6 space-y-4"
    >
      
      {error && <div className="text-red-600">{error}</div>}
      {successMsg && <div className="text-green-600">{successMsg}</div>}

      <div className="grid grid-cols-2 gap-3">
        <input
          className="border p-2 rounded"
          placeholder="First name"
          value={form.firstName}
          onChange={(e) => update('firstName', e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Last name"
          value={form.lastName}
          onChange={(e) => update('lastName', e.target.value)}
        />
      </div>

      <input
        className="border p-2 rounded w-full"
        placeholder="Address 1"
        value={form.address1}
        onChange={(e) => update('address1', e.target.value)}
      />
      <input
        className="border p-2 rounded w-full"
        placeholder="Address 2 (optional)"
        value={form.address2}
        onChange={(e) => update('address2', e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        {/* country select (stores 2-letter ISO code) */}
        <select
          name="country"
          aria-label="Country"
          className="border p-2 rounded"
          value={(form.country || '').toUpperCase()}
          onChange={(e) => update('country', e.target.value)}
        >
          <option value="">Select country</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          className="border p-2 rounded"
          placeholder="Province / State"
          value={form.province}
          onChange={(e) => update('province', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          className="border p-2 rounded"
          placeholder="City"
          value={form.city}
          onChange={(e) => update('city', e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="County (optional)"
          value={form.county}
          onChange={(e) => update('county', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Postcode"
          value={form.postcode}
          onChange={(e) => update('postcode', e.target.value)}
        />
      </div>

      <input
        className="border p-2 rounded w-full"
        placeholder="Email"
        value={form.email}
        type="email"
        onChange={(e) => update('email', e.target.value)}
      />

      <input
        className="border p-2 rounded w-full"
        placeholder="Consignee ID (optional)"
        value={form.consigneeId}
        onChange={(e) => update('consigneeId', e.target.value)}
      />

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 rounded border hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
