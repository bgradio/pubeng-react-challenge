/* Import the React library, project components and mock API */
import React from 'react'
import { Checkbox, Repeatable, Select, Text, Textarea } from './components'
import api from './mockApi'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        title: '',
        rating: 0,
        year: null,
        description: '',
        upcoming: true,
        cast: [],
      },
    }

    // Allow for `this` to be used when calling App's methods
    this.handleChange = this.handleChange.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.Input = this.Input.bind(this)
  }

  /**
   * handleChange accepts a delta, or new value, for changing the corresponding data within the App's state.
   * @param delta (any) New value or values to be changed within the state
   */
  handleChange(delta) {
    // Update the App's state to include the changes from the delta
    this.setState(({ data }) => ({ data: { ...data, ...delta }}))
  }

  /**
   * handleUpdate is performed asynchronously and updates the data based on the App's current state.
   * By default, the data will not be published unless the Publish button is pushed.
   * @param publish (boolean) Determines whether or not to post the content
   */
  async handleUpdate(publish = false) {
    const { data } = this.state
    // Store the results of posting the content
    const results = await api.post({ ...data, publish })
    console.log('Content updated!')
    return results
  }

  /**
   * Input returns the framework for containing a form object (checkbox, textarea, etc).
   * It accepts children, a boolean for if the input is iterable/repeatable, and a label and id for the form object.
   * Depending on if the form object is iterable, it sets the appropriate props to be able to handle the addition, modification, and removal of Repeatable fields.
   * @param (children (any)
   * @param  iterable (boolean) Determines that additional props are necessary if the Input has a repeatable field
   * @param  label (string) The value to be displayed to the user that describes the input
   * @param  id (string) The element ID for the field being created
   */
  Input({ children, iterable, label, id }) {
    const handleChange = value => {
      this.handleChange({ [id]: value })
    }
    const value = this.state.data[id]
    let props = {}

    // Set up a different set of props for iterable fields to handle creation, alerting, and deletion
    if(iterable) {
      props = {
        id,
        value,
        onCreate: (item) => handleChange([...value, {
          ...item,
          id: Math.floor(Math.random() * 100000),
        }]),
        onUpdate: (item) => handleChange(value.map(prev => {
          if(item.id === prev.id) {
            return item
          }
          return prev
        })),
        onDelete: (id) => handleChange(value.filter(prev => prev.id !== id))
      }
    } else {
      props = {
        id,
        value,
        onBlur: () => this.handleUpdate(false),
        onChange: e => handleChange(e.target.value),
      }
    }
    // Return the following HTML when rendering an Input and determine the field table based on the child's props
    return (
      <div className="Form-Group">
        <div className="Form-Label">{label}</div>
        {children(props)}
      </div>
    )
  }

  render() {
    const { Input } = this
    return (
      <div className="Form">
        <Input label="Title" id="title">
          {props => <Text {...props} />}
        </Input>
        <Input label="Year" id="year">
          {props => <Select {...props} />}
        </Input>
        <Input label="Upcoming" id="upcoming">
          {props => <Checkbox {...props} />}
        </Input>
        <Input label="Description" id="description">
          {props => <Textarea {...props} />}
        </Input>
        <Input label="Cast" iterable id="cast">
          {props => <Repeatable {...props} />}
        </Input>
        <button onClick={() => this.handleUpdate(true)}>
          {'Publish'}
        </button>
      </div>
    )
  }
}

export default App
