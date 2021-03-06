import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Card,
  Header,
  Dropdown,
  Grid,
  Icon,
  Button,
  Input,
  Popup
} from 'semantic-ui-react'

import AddModelEntityModal from './addModelEntityModal'
import {
  setModelParameter,
  setTransferLearningSource,
  addLayer,
  editLayer,
  removeLayer,
  getTraiendModels
} from '../../../actions/model'
import lossOptions from './options/lossOptions'
import optimizerOptions from './options/optimizerOptions'
import metricOptions from './options/metricOptions'
import transferLearningOptions from './options/transferLearningOptions'
import layerOptions from './options/layerOptions'

import './css/transferLearningBuilder.css'

class TransferLearningBuilder extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalOpen: false,
      editingLayer: null,
      trainedModelMap: {},
      transferLearningOptions: this.getDropdownOptions(
        transferLearningOptions
      )
    }

    this.lossDropdownOptions = this.getDropdownOptions(lossOptions)
    this.optimizerDropdownOptions = this.getDropdownOptions(optimizerOptions)
    this.metricDropdownOptions = this.getDropdownOptions(metricOptions)
  }

  componentDidMount() {
    const { getTraiendModels, project } = this.props;
    const { transferLearningOptions } = this.state;
    const trainedModels = getTraiendModels(project.projectId)

    if (trainedModels && trainedModels.length > 0) {
      const trainedModelMap = {}
      // Create a mapping between trained model name and trained model path
      trainedModels.forEach(trainedModel => {
        trainedModelMap[trainedModel["name"]] = trainedModel["transfer_source"]
      })

      // Make an array of trained model names
      const trainedModelNames = trainedModels.map(trainedModel => trainedModel.name)

      // Create options based on trained model names
      const trainedModelOptions = this.getDropdownOptions(
        trainedModelNames
      )

      // Append trained model options to transfer learning options
      const combinedTransferLearningOptions = transferLearningOptions.concat(trainedModelOptions)

      this.setState({
        trainedModelMap,
        transferLearningOptions: combinedTransferLearningOptions
      })
    }
  }

  toggleModal = () => {
    if (this.state.modalOpen) {
      this.setState(prevState => ({
        modalOpen: !prevState.modalOpen,
        editingLayer: null
      }))
    } else {
      this.setState(prevState => ({
        modalOpen: !prevState.modalOpen
      }))
    }
  }

  getDropdownOptions = options => {
    return options.map(option => {
      return {
        key: option,
        text: option,
        value: option
      }
    })
  }

  render() {
    const {
      model,
      setModelParameter,
      setTransferLearningSource,
      addLayer,
      editLayer,
      removeLayer
    } = this.props
    const { modalOpen, transferLearningOptions, trainedModelMap } = this.state

    return (
      <Card centered fluid className="transfer-learning-card">
        <Card.Content>
          <Header>Transfer Learning</Header>
        </Card.Content>
        <Card.Content>
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column width={4}>
                Epochs
                <Popup
                  content="Number of times the data is fed to the model"
                  trigger={
                    <Icon
                      name="question"
                      size="small"
                      className="question-icon"
                    ></Icon>
                  }
                />
                <br />
                <Input
                  fluid
                  placeholder="Epochs..."
                  size="mini"
                  defaultValue={model.epochs}
                  onChange={e => setModelParameter('epochs', e.target.value)}
                />
                <br />
                <br />
                Batch Size
                <Popup
                  content="Number of training examples used in one iteration"
                  trigger={
                    <Icon
                      name="question"
                      size="small"
                      className="question-icon"
                    ></Icon>
                  }
                />
                <br />
                <Input
                  fluid
                  placeholder="Batch Size..."
                  size="mini"
                  defaultValue={model.batchSize}
                  onChange={e => setModelParameter('batchSize', e.target.value)}
                />
                <br />
                <br />
                Learning Rate
                <Popup
                  content="Decides how much parameters change when the model is fed with data"
                  trigger={
                    <Icon
                      name="question"
                      size="small"
                      className="question-icon"
                      onClick={null}
                    ></Icon>
                  }
                />
                <br />
                <Input
                  fluid
                  placeholder="Learning Rate..."
                  size="mini"
                  defaultValue={model.learningRate}
                  onChange={e =>
                    setModelParameter('learningRate', e.target.value)
                  }
                />
                <br />
                <br />
                <Button positive>Train</Button>
              </Grid.Column>
              <Grid.Column width={12}>
                <Dropdown
                  fluid
                  placeholder="Choose model to learn on..."
                  selection
                  defaultValue={model.transferSource}
                  options={transferLearningOptions}
                  onChange={(event, { value }) => {
                    if (value in trainedModelMap) {
                      setTransferLearningSource(trainedModelMap[value])
                    } else {
                      setTransferLearningSource(value)
                    }
                  }
                  }
                />
                <br />
                {model.layers && model.layers.map((layer, index) => {
                  return (
                    <Layer
                      key={index}
                      name={layer.name}
                      settings={layer.settings}
                      remove={() => removeLayer(model.layers, layer.name)}
                      edit={() => {
                        this.setState({ editingLayer: layer }, () => {
                          this.toggleModal()
                        })
                      }}
                    />
                  )
                })}
                <Button fluid white={1} onClick={this.toggleModal}>
                  Add New Layer
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
        <Card.Content>
          <div>
            <Grid columns={3} divided centered>
              <Grid.Row>
                <Grid.Column>
                  <Dropdown
                    fluid
                    placeholder="Loss..."
                    selection
                    defaultValue={model.loss}
                    options={this.lossDropdownOptions}
                    onChange={(event, { value }) =>
                      setModelParameter('loss', value)
                    }
                  />
                </Grid.Column>
                <Grid.Column>
                  <Dropdown
                    fluid
                    placeholder="Optimizer..."
                    selection
                    defaultValue={model.optimizer}
                    options={this.optimizerDropdownOptions}
                    onChange={(event, { value }) =>
                      setModelParameter('optimizer', value)
                    }
                  />
                </Grid.Column>
                <Grid.Column>
                  <Dropdown
                    fluid
                    placeholder="Metric..."
                    selection
                    defaultValue={model.metric}
                    options={this.metricDropdownOptions}
                    onChange={(event, { value }) =>
                      setModelParameter('metric', value)
                    }
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </Card.Content>
        <AddModelEntityModal
          open={modalOpen}
          close={this.toggleModal}
          options={layerOptions}
          entityName="layer"
          modelEntities={model.layers}
          addEntity={addLayer}
          editEntity={editLayer}
          entityEditing={this.state.editingLayer}
        />
      </Card>
    )
  }
}

const Layer = props => {
  return (
    <div className="layer-label-container">
      <div>
        {props.name}{' '}
        {props.settings.map(setting => `| ${setting.name} : ${setting.value}`)}
      </div>
      <div>
        {props.settings.length > 0 && (
          <Icon
            name="pencil"
            className="layer-edit-icon"
            onClick={props.edit}
          ></Icon>
        )}
        <Icon
          name="remove"
          className="layer-delete-icon"
          onClick={props.remove}
        ></Icon>
      </div>
    </div>
  )
}

TransferLearningBuilder.propTypes = {
  setModelParameter: PropTypes.func.isRequired,
  setTransferLearningSource: PropTypes.func.isRequired,
  addLayer: PropTypes.func.isRequired,
  editLayer: PropTypes.func.isRequired,
  removeLayer: PropTypes.func.isRequired,
  getTraiendModels: PropTypes.func.isRequired,
  model: PropTypes.object
}

const mapStateToProps = state => ({
  model: state.model.model,
  project: state.projects.currentProject
})

export default connect(
  mapStateToProps,
  {
    setModelParameter,
    setTransferLearningSource,
    addLayer,
    editLayer,
    removeLayer,
    getTraiendModels
  }
)(TransferLearningBuilder)
