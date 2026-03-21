const inputBaseClassName =
  "w-full rounded-xl border border-yellow-700 bg-black/70 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 disabled:cursor-not-allowed disabled:opacity-60";

const fieldErrorClassName = "mt-1 text-xs text-rose-300";

function FormField({
  label,
  id,
  error,
  required = false,
  children
}) {
  return (
    <label className="block space-y-1" htmlFor={id}>
      <span className="text-xs font-semibold text-yellow-200">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
      {error ? <p className={fieldErrorClassName}>{error}</p> : null}
    </label>
  );
}

function SelectField({
  id,
  value,
  onChange,
  options,
  placeholder,
  disabled = false
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={inputBaseClassName}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
}

export default function RegistrationForm({
  formValues,
  errors,
  states,
  cities,
  loadingStates,
  loadingCities,
  submitting,
  otpSent,
  onChange,
  onStateChange,
  onSubmit,
  onResetOtp,
  onRetryStates,
  statesError,
  citiesError,
  onRetryCities
}) {
  return (
    <form className="mt-8 space-y-5" onSubmit={onSubmit}>
      {statesError ? (
        <div className="rounded-2xl border border-rose-400/40 bg-rose-950/40 p-4 text-sm text-rose-100">
          <p>{statesError}</p>
          <button
            type="button"
            onClick={onRetryStates}
            className="mt-3 rounded-lg border border-rose-300/40 px-3 py-2 text-xs font-semibold text-rose-100"
          >
            Retry state list
          </button>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <FormField id="userName" label="Full name" error={errors.userName} required>
          <input
            id="userName"
            type="text"
            value={formValues.userName}
            onChange={(event) => onChange("userName", event.target.value)}
            disabled={otpSent}
            placeholder="Your full name"
            className={inputBaseClassName}
          />
        </FormField>

        <FormField id="uniqueId" label="Unique id" error={errors.uniqueId} required>
          <input
            id="uniqueId"
            type="text"
            value={formValues.uniqueId}
            onChange={(event) => onChange("uniqueId", event.target.value)}
            disabled={otpSent}
            placeholder="Enter your unique id"
            className={inputBaseClassName}
          />
        </FormField>

        <FormField id="mobileNumber" label="Mobile number" error={errors.mobileNumber} required>
          <input
            id="mobileNumber"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={formValues.mobileNumber}
            onChange={(event) => onChange("mobileNumber", event.target.value)}
            disabled={otpSent}
            placeholder="10-digit mobile number"
            className={inputBaseClassName}
          />
        </FormField>

        <FormField id="emailId" label="Email" error={errors.emailId} required>
          <input
            id="emailId"
            type="email"
            value={formValues.emailId}
            onChange={(event) => onChange("emailId", event.target.value)}
            disabled={otpSent}
            placeholder="you@example.com"
            className={inputBaseClassName}
          />
        </FormField>

        <FormField id="stateId" label="State" error={errors.stateId} required>
          <SelectField
            id="stateId"
            value={formValues.stateId}
            onChange={(event) => onStateChange(event.target.value)}
            options={states}
            disabled={loadingStates || otpSent}
            placeholder={loadingStates ? "Loading states..." : "Select state"}
          />
        </FormField>

        <FormField id="cityId" label="City" error={errors.cityId} required>
          <SelectField
            id="cityId"
            value={formValues.cityId}
            onChange={(event) => onChange("cityId", event.target.value)}
            options={cities}
            disabled={!formValues.stateId || loadingCities || otpSent}
            placeholder={
              !formValues.stateId
                ? "Select state first"
                : loadingCities
                  ? "Loading cities..."
                  : "Select city"
            }
          />
          {citiesError ? (
            <div className="mt-2 rounded-xl border border-rose-400/40 bg-rose-950/30 p-3 text-xs text-rose-100">
              <p>{citiesError}</p>
              <button
                type="button"
                onClick={onRetryCities}
                className="mt-2 rounded-lg border border-rose-300/40 px-3 py-2 font-semibold text-rose-100"
              >
                Retry city list
              </button>
            </div>
          ) : null}
        </FormField>

        <FormField id="userPincode" label="Pincode" error={errors.userPincode} required>
          <input
            id="userPincode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={formValues.userPincode}
            onChange={(event) => onChange("userPincode", event.target.value)}
            disabled={otpSent}
            placeholder="6-digit pincode"
            className={inputBaseClassName}
          />
        </FormField>

        <FormField id="dateOfBirth" label="Date of birth" error={errors.dateOfBirth} required>
          <input
            id="dateOfBirth"
            type="date"
            value={formValues.dateOfBirth}
            onChange={(event) => onChange("dateOfBirth", event.target.value)}
            disabled={otpSent}
            className={inputBaseClassName}
          />
        </FormField>

        {otpSent ? (
          <FormField id="otp" label="OTP" error={errors.otp} required>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              value={formValues.otp}
              onChange={(event) => onChange("otp", event.target.value)}
              placeholder="Enter OTP"
              className={inputBaseClassName}
            />
          </FormField>
        ) : null}
      </div>

      {otpSent ? (
        <button
          type="button"
          onClick={onResetOtp}
          className="text-sm font-semibold text-yellow-300 hover:text-yellow-200"
        >
          Change registration details
        </button>
      ) : null}

      <button
        type="submit"
        disabled={submitting || loadingStates}
        className="w-full rounded-xl bg-yellow-400 py-3 text-base font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting
          ? "Please wait..."
          : otpSent
            ? "Verify OTP and complete registration"
            : "Send OTP"}
      </button>
    </form>
  );
}
