import React from 'react';
import logo from './logo.svg';
import './App.css';
import yaml from 'js-yaml';
import {FormUnit} from 'pivotal-ui/react/forms';
import {Radio, RadioGroup} from 'pivotal-ui/react/radio';

const selectorYML = `
  - name: example_selector
    type: selector
    configurable: true
    default: Pizza
    freeze_on_deploy: true
    option_templates:
      - name: pizza_option
        select_value: Pizza
        named_manifests:
          - name: my_snippet
            manifest: |
              pizza_toppings:
                pepperoni: (( .properties.example_selector.pizza_option.pepperoni.value ))
                pineapple: (( .properties.example_selector.pizza_option.pineapple.value ))
                other: (( .properties.example_selector.pizza_option.other_toppings.value ))
                cheesy_vm_type: (( .properties.example_selector.pizza_option.cheesy_vm_type.value ))
          - name: provides_section
            manifest: |
              as: 'pizza_link_web_server_job'
          - name: consumes_section
            manifest: |
              from: 'pizza_link_web_server_job'
        property_blueprints:
          - name: pepperoni
            type: boolean
            configurable: true
            freeze_on_deploy: true
          - name: pineapple
            type: boolean
            configurable: true
            default: true
          - name: other_toppings
            type: string
            configurable: true
            optional: true
            constraints:
            - must_match_regex: '\\A[^!@#$%^&*()]*\\z'
              error_message: 'This name cannot contain special characters.'
          - name: cheesy_vm_type
            type: vm_type_dropdown
            configurable: true
            optional: true
            resource_definitions:
            - name: ram
              configurable: true
              default: 1024
            - name: ephemeral_disk
              configurable: true
              default: 1024
            - name: cpu
              configurable: true
              default: 1
      - name: filet_mignon_option
        select_value: Filet Mignon
        named_manifests:
          - name: my_snippet
            manifest: |
              rarity: (( .properties.example_selector.filet_mignon_option.rarity_dropdown.value ))
              review: (( .properties.example_selector.filet_mignon_option.review.value ))
              secret_sauce: (( .properties.example_selector.filet_mignon_option.secret_sauce.value ))
          - name: provides_section
            manifest: |
              as: 'filet_mignon_link_web_server_job'
          - name: consumes_section
            manifest: |
              from: 'filet_mignon_link_web_server_job'
        property_blueprints:
          - name: rarity_dropdown
            type: dropdown_select
            configurable: true
            default: rare
            options:
              - name: rare
                label: 'Rare'
              - name: medium
                label: 'Medium'
              - name: well-done
                label: 'Well done'
          - name: review
            type: string
            configurable: true
            default: A+++++ power seller of mail order steak
            optional: false
          - name: secret_sauce
            type: secret
            configurable: true
            optional: true
          - name: vcenter_hosturl
            type: string
            configurable: true
            optional: true
          - name: vcenter_username
            type: string
            configurable: true
            optional: true
          - name: vcenter_password
            type: secret
            configurable: true
            optional: true
          - name: datacenter
            type: string
            configurable: true
            optional: true
          - name: datastore_pattern
            type: string
            configurable: true
            optional: true
      - name: beverage_option
        select_value: Beverage
        property_blueprints:
          - name: cola
            label: Cola
            type: string
            configurable: true
            optional: true
        named_manifests:
          - name: my_snippet
            manifest: |
              beverage: (( .properties.example_selector.beverage_option.cola.value ))
          - name: provides_section
            manifest: |
              as: 'beverage_link_web_server_job'
          - name: consumes_section
            manifest: |
              from: 'beverage_link_web_server_job'
`;

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {selection: null};
  }

  render() {
    const {selection} = this.state;

    const selectorJSON = yaml.safeLoad(selectorYML)[0];
    console.log(selectorJSON);
    return (
      <div className="App">
        <h3>{selectorJSON.name}</h3>
        <RadioGroup value={selection} name="radio-group" onChange={event => {
          console.log('radio group on change', event.target.value)
          this.setState({selection: event.target.value})}}>
          {selectorJSON.option_templates.map(option => {
            return <FormUnit {...{label: option.name, labelPosition: 'after', key: option.name}}>
              <Radio value={option.select_value}>{option.name}</Radio>
            </FormUnit>
          })}
        </RadioGroup>
      </div>
    );
  }
}

export default App;
