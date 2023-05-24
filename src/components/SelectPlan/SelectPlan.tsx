import React, { useState } from 'react';
import * as SC from './SelectPlan.styles';
import Switch from '../Switch';
import { FormFieldsEnum, PlanBillingEnum, PlanTypeEnum } from '../../enums';
import { Field, FormikErrors, FormikValues } from 'formik';
import useFormContext from '../../context/formContext/useFormContext';
import { planTypes } from '../../constants';
import { getFormattedPrice } from '../../utils';

const SelectPlan: React.FC = () => {
  const { values: formContextValues, setValues } = useFormContext();

  const [selectedPlanBilling, setSelectedPlanBilling] =
    useState<PlanBillingEnum>(formContextValues.planBilling);

  const [selectedPlanType, setSelectedPlanType] = useState<PlanTypeEnum>(
    formContextValues.planType
  );

  const isYearlySelected = selectedPlanBilling === PlanBillingEnum.YEARLY;

  return (
    <SC.Wrapper>
      <Field name={FormFieldsEnum.PLAN_TYPE}>
        {({
          form: { setFieldValue },
        }: {
          form: {
            setFieldValue: (
              field: string,
              value: any,
              shouldValidate?: boolean | undefined
            ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
          };
        }) => {
          const handlePlanTypeClick = (planType: PlanTypeEnum) => {
            setSelectedPlanType(planType);
            setFieldValue(FormFieldsEnum.PLAN_TYPE, planType);
            setValues({
              ...formContextValues,
              [FormFieldsEnum.PLAN_TYPE]: planType,
            });
          };

          return (
            <SC.PlanTypes>
              {planTypes.map((planType) => {
                const { icon, name } = planType;

                const isSelected = selectedPlanType === name;

                const planPrice = getFormattedPrice({
                  planType: name,
                  planBilling: selectedPlanBilling,
                });

                return (
                  <SC.PlanType
                    key={name}
                    $isSelected={isSelected}
                    onClick={() => handlePlanTypeClick(name)}
                  >
                    <div>
                      <img src={icon} alt="" height={40} />
                    </div>
                    <SC.Description>
                      <SC.Name>{name}</SC.Name>
                      <SC.Price>{planPrice}</SC.Price>
                      {selectedPlanBilling === PlanBillingEnum.YEARLY && (
                        <SC.Offer>2 months free</SC.Offer>
                      )}
                    </SC.Description>
                  </SC.PlanType>
                );
              })}
            </SC.PlanTypes>
          );
        }}
      </Field>

      <Field name={FormFieldsEnum.PLAN_BILLING}>
        {({
          form: { setFieldValue },
        }: {
          form: {
            setFieldValue: (
              field: string,
              value: any,
              shouldValidate?: boolean | undefined
            ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
          };
        }) => {
          const handlePlanBillingClick = (planBilling: PlanBillingEnum) => {
            setSelectedPlanBilling(planBilling);
            setFieldValue(FormFieldsEnum.PLAN_BILLING, planBilling);
            setValues({
              ...formContextValues,
              [FormFieldsEnum.PLAN_BILLING]: planBilling,
            });
          };

          return (
            <SC.SwitchWrapper>
              <SC.BillingType
                $isSelected={!isYearlySelected}
                onClick={() => handlePlanBillingClick(PlanBillingEnum.MONTHLY)}
              >
                Monthly
              </SC.BillingType>
              <div>
                <Switch
                  isSwitched={isYearlySelected}
                  handleSwitch={() => {
                    handlePlanBillingClick(
                      isYearlySelected
                        ? PlanBillingEnum.MONTHLY
                        : PlanBillingEnum.YEARLY
                    );
                  }}
                />
              </div>
              <SC.BillingType
                $isSelected={isYearlySelected}
                onClick={() => handlePlanBillingClick(PlanBillingEnum.YEARLY)}
              >
                Yearly
              </SC.BillingType>
            </SC.SwitchWrapper>
          );
        }}
      </Field>
    </SC.Wrapper>
  );
};

export default SelectPlan;
